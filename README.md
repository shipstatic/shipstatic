# shipstatic

Deploy static websites, landing pages, and prototypes instantly — from the terminal or from code.

> **Looking for the main package?** This is the unscoped alias for **[`@shipstatic/ship`](https://www.npmjs.com/package/@shipstatic/ship)** — same CLI, same SDK, shorter name. The full documentation lives there.

## Deploy in seconds — no install, no account

```bash
npx shipstatic ./dist
```

That's it. Your site is live on `*.shipstatic.com`. No sign-up, no config, no global install. Got Node? You're ready.

A single file works the same way:

```bash
npx shipstatic ./index.html
```

**What comes back:** the live URL, plus a **claim URL** — visit it to keep the site permanently. Anonymous deployments are **public** and **expire in 3 days**.

## Password-protect a deployment

```bash
npx shipstatic ./dist --password "correct-horse-battery-staple"
```

Visitors are prompted before the site is served. Works on a single file too:

```bash
npx shipstatic ./index.html --password "correct-horse-battery-staple"
```

The password can also come from the environment, which keeps it out of your shell history and CI logs:

```bash
SHIP_PASSWORD="correct-horse-battery-staple" npx shipstatic ./dist
```

## For scripts and agents

Add `--json` to any command for machine-readable output — on success **and** on failure:

```bash
npx shipstatic ./dist --json
```

- **Exit code** is `0` on success, non-zero on failure — branch on it, not on the text.
- **Errors** are JSON too under `--json`, carrying a stable `error` type and `status`. Branch on those, never on the message string.
- **`--no-color`** is honoured, and colour is disabled automatically when output is not a TTY.
- **`SHIP_PASSWORD`** sets `--password` from the environment.

Deploying anonymously needs no credentials at all — which is what makes `npx shipstatic ./dist` safe to run in a sandbox with no secrets configured. Just remember such deployments are public and expire in 3 days; the claim URL in the output is how they become permanent.

## Install (optional, for repeat use)

```bash
npm install -g shipstatic   # global CLI — provides the `ship` command
```

> The command is **`ship`**, matching `@shipstatic/ship` exactly. As a project dependency: `npm install shipstatic`.

## Use it as an SDK

```javascript
import Ship from 'shipstatic';

const ship = new Ship();
const result = await ship.deploy('./dist');
// result.deployment → live URL
// result.claim      → visit to keep permanently
```

`shipstatic` and `@shipstatic/ship` resolve to the **same module**, so importing either name gives you the identical class:

```javascript
import Ship from 'shipstatic'; // these are
import Ship from '@shipstatic/ship'; // the same thing
```

## Everything else

Custom domains, API keys, deploy tokens, deployment management, the full SDK reference — all documented once, in **[`@shipstatic/ship`](https://www.npmjs.com/package/@shipstatic/ship)**.

This README deliberately covers only the quickstart. A forwarder that copies its target's documentation is just a second copy to keep true — and the day it stops being true, it is worse than no documentation at all.

## License

MIT
