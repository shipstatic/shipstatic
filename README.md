# shipstatic

CLI and SDK for [ShipStatic](https://shipstatic.com) — deploy static websites, landing pages, and prototypes instantly from the terminal or code.

## Deploy in seconds — no install, no account

```bash
npx shipstatic ./dist
```

That's it. Your site is live on `*.shipstatic.com`. No sign-up, no config, no global install. Got Node? You're ready.

The output includes a **claim URL** — visit it to keep the site permanently. Anonymous deployments are public and expire in 3 days.

```javascript
import Ship from 'shipstatic';

const ship = new Ship();
const result = await ship.deploy('./dist');
// result.deployment → live URL (happy-cat-abc1234.shipstatic.com)
// result.claim      → visit to keep permanently
```

## Install (optional, for repeat use)

```bash
npm install -g shipstatic   # global CLI — the `ship` command
```

> As a project dependency: `npm install shipstatic`

## What this package is

`shipstatic` is the unscoped name for [`@shipstatic/ship`](https://www.npmjs.com/package/@shipstatic/ship). It forwards to that package and has **no API of its own** — same CLI, same SDK, shorter name.

The two are interchangeable. Install whichever name you prefer; both resolve to the same implementation, so nothing behaves differently:

```javascript
import Ship from 'shipstatic';          // these are
import Ship from '@shipstatic/ship';    // the same thing
```

## Documentation

Every command, SDK method, authentication mode, and custom-domain flow is documented **once**, in [`@shipstatic/ship`](https://www.npmjs.com/package/@shipstatic/ship).

This README deliberately does not restate any of it. A forwarder that copies its target's documentation is just a second copy to keep true — and the day it stops being true, it is worse than no documentation at all.

## License

MIT
