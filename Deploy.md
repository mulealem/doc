# Deploy — docs (docs.payment.et)

PyGate developer documentation site. Built with **Fumadocs + MDX** on
Next.js 16. The build emits a fully static export to `doc/out/`.

## Public URL

`https://docs.payment.et`

## Recommended: Coolify **Static Site** resource (no container)

This is the lightest deployment. Coolify runs the install + build
step and serves the resulting `out/` directory directly — no Node
runtime, no nginx, no container, no compose layer.

### Where the fields live in Coolify v4

When you click **+ New → Static Site**, the form has several tabs.
You'll use the **General** tab.

| UI field (General tab) | Value |
|---|---|
| Resource type | **Static Site** |
| Git Repository | `https://github.com/mulealem/doc.git` |
| Git Branch | `main` |
| **Install Command** | `npm install` |
| **Build Command** | `npm run build` |
| **Publish Directory** | `out` |
| **Port** | leave blank (Static Sites don't expose a port) |
| **Domain** | `docs.payment.et` (in the **Domains** tab, not General) |
| Build Arguments | recommended: see "Build Arguments" below |

If your Coolify build is older and the form only shows Git
Repository / Branch / **Publish Directory** (no Build Command
field), see "Older Coolify versions" below — Coolify will auto-detect
`npm run build` from `package.json` in that case.

**Base Directory / Build Path:** the Static Site form does not have
this field in v4 — it always builds from the repo root. If you see
one anyway, set it to `/doc` (Fumadocs lives in the `doc/` sub-folder
of this monorepo).

> Don't see "Install Command" and "Build Command" in v4? Make sure
> you're on a recent Coolify v4.x — older versions hid those fields.
> The "publish directory = `out`" is the only thing those versions
> let you configure; everything else is inferred.

> **If you ever created this resource as an Application instead of a
> Static Site** (because the docs above are easy to skim past), the
> Application path runs `docker compose up` which injects Coolify's
> `COOLIFY_URL` / `COOLIFY_FQDN` env into the container — and any
> malformed entry in the Domains tab (missing `:` after `https`, stray
> port, etc.) will produce invalid Caddy labels and a 502 on the whole
> vhost, even when the container, healthcheck, and nginx upstream are
> all green. **If you're on the Application route and seeing 502 with a
> healthy build, convert to a Static Site** — see "Convert an existing
> Application to a Static Site" below.

| Field | Value |
|---|---|
| Resource type | **Static Site** |
| Git repo | `https://github.com/mulealem/doc.git` |
| Git Branch | `main` |
| **Install Command** | `npm install` |
| **Build Command** | `npm run build` |
| **Publish Directory** | `out` |
| **Base Directory** (if shown) | `/doc` |
| **Port** | leave blank |
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

## Troubleshooting: site returns 502 / "can't be reached"

If `https://docs.payment.et` returns **`502 Bad Gateway`** from Caddy
(empty body, no app error — the browser often renders this as "site
can't be reached"), the **Coolify reverse proxy is receiving the
request but has no working upstream**. DNS is fine; the static export
is fine. The cause is always one of these — check in order:

1. **The Static Site resource doesn't exist** (or was deleted), but a
   `*.payment.et` wildcard cert in Caddy is matching the SNI. Create
   the resource per the table above.
2. **The Static Site resource is unhealthy / not deployed.** Open it in
   Coolify → **Deployments** → latest → **Build Logs** and look at the
   last lines:
   - `Route (app)` lines + an `out/` produced → build is fine; the
     problem is **domain attachment** or **Coolify proxy**, jump to (4).
   - `npm error ERESOLVE` / `peerDependencies` → `legacy-peer-deps`
     isn't being read. As a defense-in-depth fix, add
     `NPM_CONFIG_LEGACY_PEER_DEPS=true` to **Build Arguments** on the
     Static Site (on top of the committed `doc/.npmrc`). Redeploy.
   - `Cannot find module 'next'` / `package.json not found` → the
     **Base Directory** is wrong. Set it to exactly `/doc` (not empty,
     not `./doc`).
   - `EBADENGINE` / Node version mismatch → set the resource to
     **Node 22** (matches `doc/Dockerfile`).
   - Build succeeds but the publish dir is empty → the **Publish
     Directory** is wrong. It must be exactly `out` (relative to
     `/doc`, so the real path Coolify serves from is `/doc/out`).
     **Not** `doc/out`, **not** `public`, **not** `/doc/out`.
3. **The build is green but `Publish Directory` contains `out/index.html`**
   and you still get 502 → the **Domain isn't attached** to this
   resource in Coolify. Open **Domains**, add `docs.payment.et`, wait
   for the cert to be marked **Issued / Active**.
4. **Resource is healthy, domain is attached, cert is issued, still 502.**
   Read the **Coolify proxy logs** (resource → **Logs**, or
   `docker logs coolify-proxy` on the host). Search for
   `docs.payment.et` — the upstream address Caddy is trying and the
   error reason are both there.
5. **The build log shows a malformed `COOLIFY_URL` line**, e.g.

   ```
   COOLIFY_URL=https://docs.payment.et,https//docs.shewapost.com
   COOLIFY_FQDN=docs.payment.et,https
   ```

   The second entry is missing its colon (`https//` instead of
   `https://`). This is a stale / corrupted entry in the resource's
   **Domains** tab — Coolify joins every attached domain into
   `COOLIFY_URL` and `COOLIFY_FQDN` and renders invalid Caddy labels
   from any malformed entry, which makes the whole vhost fail. Open
   the resource → **Domains** → remove the malformed entry (keep only
   `docs.payment.et`) → **Redeploy**.

### Quick on-host checks

```bash
# DNS — should resolve to your Coolify VPS, not localhost / nothing
nslookup docs.payment.et
# → expect: Name: docs.payment.et  Address: <Coolify VPS IP>

# Proxy health — should NOT be 502 once the upstream is fixed
curl -sS -I --max-time 10 https://docs.payment.et
# → expect: HTTP/1.1 200 OK  (or 308 → https → 200)

# If 502, confirm Caddy is the responder (means TLS + proxy are alive,
# only the upstream is broken):
curl -sSI --max-time 10 https://docs.payment.et | grep -i server
# → expect: Server: Caddy
```

## Convert an existing Application to a Static Site

If the doc resource was originally created as an **Application** (it
uses `doc/Dockerfile` / `doc/docker-compose.yml`, runs an nginx
container on port 8080, and the build log shows `docker compose … up
--build`) and you want the lighter, more robust Static Site route:

1. **Open the existing Application** and note down:
   - Git repo URL and branch.
   - Any Build Arguments you set
     (`NEXT_PUBLIC_DASHBOARD_URL`, `NEXT_PUBLIC_CHECKOUT_URL`, …).
   - Attached domain(s).
2. **Delete the Application resource.** This removes the
   `pygate-docs` / `hbh6udmnajikkabvq27ooa9v-*` containers and any
   corrupted domain entries that were injecting malformed `COOLIFY_URL`
   values.
3. **Add Resource → Static Site** with:

   | Field | Value |
   |---|---|
   | Resource type | **Static Site** |
   | Git repo | `https://github.com/mulealem/doc.git` |
   | Branch | `main` |
   | **Install Command** | `npm install` |
   | **Build Command** | `npm run build` |
   | **Publish Directory** | `out` |
   | **Base Directory** (if shown) | `/doc` |
   | **Domain** | `docs.payment.et` |
   | **Build Arguments** | `NEXT_PUBLIC_DASHBOARD_URL`, `NEXT_PUBLIC_CHECKOUT_URL` (paste the same values you saved) |

4. **Deploy.** Coolify will run `npm install && npm run build` (the same
   command the Dockerfile's builder stage runs) and serve `out/`
   directly — no container, no compose, no `COOLIFY_URL` injection.
5. Verify: `curl -sS -I --max-time 10 https://docs.payment.et/` →
   `HTTP/1.1 200 OK` with a real HTML body.

> The repo's `doc/Dockerfile` and `doc/docker-compose.yml` are kept for
> parity / fallback only and are no longer used once you're on a Static
> Site. You can leave them in the repo untouched; deleting them is
> optional cleanup.

## Roll-forward

- Documentation updates are pure content. Push to the repo, redeploy.
- Contract tests under `doc/__tests__/` validate that the documented
  payloads still match the API shapes — run them in CI before merging.
- If you ever change `Base Directory` or `Publish Directory` in the
  Coolify Static Site resource, **also redeploy** — the publish path
  is captured at build time, not request time.
