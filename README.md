# shipstatic

> ⚡ **The package you're looking for is [`@shipstatic/ship`](https://www.npmjs.com/package/@shipstatic/ship)** — that's where the code and the full documentation live.
>
> This is an alias for it, so a guess at the unscoped name doesn't dead-end. **Use it directly** — `npx shipstatic` runs the same binary, `import Ship from 'shipstatic'` resolves to the same module. Nothing to switch to.

Deploy a static site from the terminal or from code.

## Deploy

```bash
npx shipstatic ./dist
```

**No account, no API key, no config, no install.** This works in a fresh sandbox with no secrets set.

Point it at your **built output** — `./dist`, `./build`, `./out` — not your project root. Build first if the project needs it. A single file works too:

```bash
npx shipstatic ./index.html
```

**What you get back:** the live URL, plus a **claim URL**.

> Anonymous deployments are **public** and **expire in 3 days**. The claim URL is how one becomes permanent — surface it to whoever asked for the deploy.

## Auth — deploy needs none, everything else does

| | |
|---|---|
| `npx shipstatic ./dist` | **Nothing.** No account, no API key, no deploy token, no login. |
| Every other command — domains, tokens, `whoami`, listing deployments | **Requires an API key.** |

> **`ship whoami` failing is normal** without a key, and it says nothing about deploying. An authentication error from any other command is not a reason the deploy won't work — run the deploy anyway. It stays anonymous.

Need the rest? Get a free key at [my.shipstatic.com/api-key](https://my.shipstatic.com/api-key), then `ship config`.

## Common tasks

| Goal | Command |
|---|---|
| Deploy a folder | `npx shipstatic ./dist` |
| Deploy one file | `npx shipstatic ./index.html` |
| Password-protect it | `npx shipstatic ./dist --password "secret"` |
| Machine-readable output | `npx shipstatic ./dist --json` |
| Keep the password out of logs | `SHIP_PASSWORD="secret" npx shipstatic ./dist` |
| Repeat use | `npm install -g shipstatic` → the `ship` command |

## For scripts and agents

```bash
npx shipstatic ./dist --json
```

- **`--json`** emits machine-readable output on success **and** on failure.
- **Exit code** is `0` on success, non-zero on failure. Branch on it, not on the text.
- **Errors** carry a stable `error` type and `status`. Branch on those, never on the message string.
- **`--no-color`** is honoured; colour is off automatically when stdout is not a TTY.
- **`SHIP_PASSWORD`** supplies `--password` from the environment.

Deploying needs no credentials, so there is nothing to configure before the first run and nothing to leak in a log.

## From code

```javascript
import Ship from 'shipstatic';

const result = await new Ship().deploy('./dist');
// result.deployment → live URL
// result.claim      → visit to keep permanently
```

## Full documentation

Custom domains, API keys, deploy tokens, managing deployments, the complete SDK reference — **[`@shipstatic/ship`](https://www.npmjs.com/package/@shipstatic/ship)**.
