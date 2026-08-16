# Deploy — docs (docs.payment.et)

PyGate developer documentation site. Built with **Fumadocs + MDX** on
Next.js 16. The build emits a fully static export to `doc/out/`.

## Public URL

`https://docs.payment.et`

## Recommended: Coolify **Static Site** resource (no container)

This is the lightest deployment. Coolify runs `npm run build` and serves
the resulting `out/` directory directly — no Node runtime, no nginx.

| Field | Value |
|---|---|
| Resource type | **Static Site** |
| Git repo | this monorepo |
| **Base Directory** | `/doc` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `out` |
| **Node version** | 22 |
| **Domain** | `docs.payment.et` |

That is the entire config — no env vars required if you keep the
defaults in `doc/.env.example`. If you want to override the public URLs
that show up in the docs:

> **Peer-deps note:** `doc/.npmrc` sets `legacy-peer-deps=true` because
> `fumadocs-core@15` declares `peerOptional next@"14.x.x || 15.x.x"` while
> this project pins Next 16 (works fine in practice). Without the flag,
> fresh `npm install`s fail with ERESOLVE — including the Docker build.

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_DASHBOARD_URL` | `https://dashboard.payment.et` |
| `NEXT_PUBLIC_CHECKOUT_URL` | `https://checkout.payment.et` |

Set them in **Build Arguments** (Coolify static sites don't have a
runtime env panel — `NEXT_PUBLIC_*` is baked at build time).

## Alternative: containerised (kept for parity)

If you must deploy via the **Application** resource type, this folder
also contains a Dockerfile that builds the same static export (`out/`)
and serves it with nginx on port 8080. Coolify config would be:

| Field | Value |
|---|---|
| Resource type | **Application** (Public) |
| **Build Path** | `/doc` |
| **Port** | `8080` |
| **Healthcheck path** | `/` |
| **Domain** | `docs.payment.et` |

> Static Site is preferred: it skips the Node runtime, removes one
> container, and gets you a CDN-friendly origin.

## First deploy (Static Site route)

1. Add the **Static Site** resource with the values above.
2. Deploy. Coolify will run `npm install && npm run build` and serve
   `out/` from a CDN-friendly origin.
3. Visit `https://docs.payment.et` — you should see the PyGate docs.

## Roll-forward

- Documentation updates are pure content. Push to the repo, redeploy.
- Contract tests under `doc/__tests__/` validate that the documented
  payloads still match the API shapes — run them in CI before merging.
