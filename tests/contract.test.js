import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ROOT } from './helpers.js';

const require_ = createRequire(import.meta.url);
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
// Readable only because ship 1.1.0 exports "./package.json" — the same release
// that added "./cli". Before it, this fence could not have been written.
const shipPkg = JSON.parse(readFileSync(require_.resolve('@shipstatic/ship/package.json'), 'utf8'));

/**
 * Subpaths ship exports that this package deliberately does NOT mirror.
 *
 * Recorded rather than merely absent: an unexplained gap reads as an oversight
 * to the next person, who then "fixes" it. The fence below fails on any subpath
 * that is neither mirrored nor named here — and separately, on a record that
 * has gone stale.
 */
const UNMIRRORED_SUBPATHS = {
  './cli':
    "exists on ship SOLELY so this package's bin can require it. Mirroring it " +
    'would forward a forwarder — shipstatic/cli resolving to bin.cjs, whose only ' +
    'content is require("@shipstatic/ship/cli") — and would publish plumbing as ' +
    'public surface from a package whose identity is having no API of its own. ' +
    'No caller has a reason to reach it: the thing ./cli exists to serve is the ' +
    'bin, and this package IS that bin.',
};

/** Every local file path a manifest field points at, flattened. */
function referencedPaths(value, found = []) {
  if (typeof value === 'string') {
    if (value.startsWith('./')) found.push(value);
  } else if (value && typeof value === 'object') {
    for (const v of Object.values(value)) referencedPaths(v, found);
  }
  return found;
}

describe('the forward mirrors ship', () => {
  it('declares every condition ship declares', () => {
    // THE drift fence. ship owns which conditions exist; this package only
    // forwards them. The day ship adds one — `deno`, `worker`, `react-native` —
    // a consumer resolving `shipstatic` under it would silently fall through to
    // a condition meant for somewhere else. This fails instead, and names it.
    const shipConditions = Object.keys(shipPkg.exports['.']);
    const ourConditions = Object.keys(pkg.exports['.']);
    const missing = shipConditions.filter((c) => !ourConditions.includes(c));

    expect(
      missing,
      `@shipstatic/ship declares ${missing.join(', ')} and this package does not. ` +
        'Mirror it in exports["."] — a forwarder that drops a condition sends that ' +
        'platform to the wrong build.',
    ).toEqual([]);
  });

  it("tracks ship's MAJOR version", () => {
    // The cutover trap, made mechanical. When ship 2.0 takes `latest`, a
    // wrapper still depending on ^1 would serve the OLD CLI under
    // `npx shipstatic` while `npx @shipstatic/ship` served the new one — the
    // exact divergence this package exists to prevent, and entirely invisible
    // because both halves keep working. Bump both together, or fail here.
    const ourMajor = pkg.version.split('.')[0];
    const depMajor = pkg.dependencies['@shipstatic/ship'].replace(/^\D*/, '').split('.')[0];

    expect(
      depMajor,
      `this package is ${pkg.version} but depends on @shipstatic/ship ` +
        `${pkg.dependencies['@shipstatic/ship']}. The forwarded API IS ship's API, so ` +
        'the majors move together.',
    ).toBe(ourMajor);
  });

  it('mirrors every subpath ship exports, or records why not', () => {
    // The condition fence above watches `.`; this one watches the KEYS beside
    // it. If ship ever adds a real API subpath — drop publishes a `./testing`,
    // so it is not hypothetical — a forwarder that silently lacks it is no
    // longer interchangeable, and nothing would have said so.
    const unexplained = Object.keys(shipPkg.exports).filter(
      (subpath) => !(subpath in pkg.exports) && !(subpath in UNMIRRORED_SUBPATHS),
    );

    expect(
      unexplained,
      `@shipstatic/ship exports ${unexplained.join(', ')} and this package neither ` +
        'mirrors it nor records why. Add it to exports, or to UNMIRRORED_SUBPATHS ' +
        'with the reason.',
    ).toEqual([]);
  });

  it('keeps its recorded non-mirrors honest', () => {
    // A record that outlives the thing it describes is worse than no record —
    // it documents a decision about a subpath that no longer exists.
    for (const subpath of Object.keys(UNMIRRORED_SUBPATHS)) {
      expect(
        shipPkg.exports[subpath],
        `${subpath} is recorded as deliberately unmirrored, but ship no longer ` +
          'exports it. Delete the record.',
      ).toBeDefined();
    }
  });

  it('depends on a ship new enough to expose ./cli', () => {
    // bin.cjs requires the declared subpath, which did not exist before 1.1.0.
    expect(shipPkg.exports['./cli']).toBeDefined();
  });
});

describe('the published artifact is complete', () => {
  it('ships every file its manifest points at', () => {
    // A condition added without a matching `files` entry produces a package
    // that resolves locally and 404s for everyone else — the failure that only
    // appears after publishing, when the version is already immutable.
    const referenced = new Set([
      ...referencedPaths(pkg.exports),
      ...referencedPaths(pkg.bin),
      pkg.main,
      pkg.module,
      pkg.types,
    ]);

    for (const path of referenced) {
      if (!path || path === './package.json') continue;
      const bare = path.replace(/^\.\//, '');
      expect(existsSync(join(ROOT, bare)), `${path} does not exist`).toBe(true);
      expect(pkg.files, `${path} is referenced but not in "files"`).toContain(bare);
    }
  });

  it('keeps the bin executable by a shell', () => {
    const bin = readFileSync(join(ROOT, 'bin.cjs'), 'utf8');
    expect(bin.startsWith('#!/usr/bin/env node')).toBe(true);
  });

  it('adds no API of its own', () => {
    // The identity of this package: a name, not a layer. Anything worth adding
    // belongs in @shipstatic/ship, where the implementation and its tests live.
    expect(pkg.dependencies).toEqual({ '@shipstatic/ship': expect.any(String) });
  });
});
