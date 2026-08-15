# pygate/doc

The PyGate developer documentation site. Built with **Fumadocs** on **Next.js 16** with **MDX**. Static-exported to `out/` and served by an Nginx alpine container. This project replaces the previous Nextra-based site in `../docs`.

## Local development

```bash
npm install
npm run dev          # http://localhost:3003
```

## Write a new page

1. Create a new `.mdx` file under `content/docs/`. The catch-all route `app/[[...slug]]/page.tsx` picks it up automatically; run `npm run mdx` to regenerate `.source/` if the dev server doesn't pick it up.
2. Add a frontmatter block:

   ```mdx
   ---
   title: Your page title
   description: What this page is about (1-2 sentences).
   ---
   ```

3. Add the page to the navigation. Root order lives in `content/docs/meta.json`; each section has its own `meta.json` (e.g. `content/docs/api-reference/meta.json`) with a `pages` array. Section metadata uses `title` + `pages`; the root file maps slugs to display names:

   ```json
   {
     "index": "Introduction",
     "quickstart": "Quickstart",
     "concepts": "Concepts"
   }
   ```

4. Available components: Fumadocs defaults (`<Callout>`, `<Tabs>`/`<Tab>`, …) come from `mdx-components.tsx`; project-specific ones are `<Endpoint>`, `<Params>`/`<Param>`, `<Response>`, `<WebhookEvent>` (import from `@/components`). Code samples and payloads live in `lib/examples/` as typed constants so the contract tests can validate them.

## Search

Search is client-side (Orama) with the index built at build time: `app/api/search/route.ts` exports `staticGET` from `fumadocs-core/search/server`, which `next build` prerenders into a static JSON file served to the browser. No external search service needed. The client is wired in `app/layout.tsx` (`RootProvider` with `type: "static"`).

## Verify examples stay in sync

```bash
npm test
```

Contract tests in `__tests__/contracts/` assert that:

- The example payloads in `lib/examples/responses.ts` match the documented schemas in `lib/schemas.ts`
- The HMAC signing formula in the docs matches the implementation in `lib/signing.ts`
- Code samples in `lib/examples/{curl,node,python,php,go}.ts` reference the correct base URL and required fields

## Build for production

```bash
npm run build        # fumadocs-mdx && next build
```

Produces a fully static site in `out/`, including the search index JSON. Upload to any CDN — Cloudflare Pages, Netlify, S3 + CloudFront, plain Nginx.

## Deploy with Docker

```bash
docker compose up --build
```

Container listens on `http://localhost:3003` (host port 3003 → container port 8080).

## Configuration

| Env | Purpose | Default |
|---|---|---|
| `NEXT_PUBLIC_DASHBOARD_URL` | URL of the PyGate dashboard, used in the nav "Dashboard" link and `metadataBase` | `https://dashboard.example.com` |
| `NEXT_PUBLIC_CHECKOUT_URL` | URL of the PyGate checkout app (reserved; not currently read by code) | `https://checkout.example.com` |

The docs site is fully static at build time — `NEXT_PUBLIC_*` values are inlined into the HTML, so there's no runtime env to worry about.

## Troubleshooting

- **`next build` fails on type errors in `__tests__/`** — Next 16 type-checks the whole project. Fix the types (e.g. `readonly` mismatches against `as const` schemas) rather than excluding tests.
- **Pages missing from the sidebar** — run `npm run mdx` to regenerate `.source/`, then restart the dev server.
