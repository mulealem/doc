# syntax=docker/dockerfile:1
#
# PyGate developer docs — Fumadocs + MDX, Next.js 16, `output: "export"`.
#
# Recommended deploy target is the Coolify **Static Site** resource type
# (Build Command `npm run build`, Publish Directory `out`). This Dockerfile
# is the containerised fallback: build the static export and serve it with
# nginx on port 8080. Coolify terminates TLS, so no TLS is configured here.

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

FROM base AS deps
# Coolify injects NODE_ENV=production into the build environment, which makes
# npm skip devDependencies (fumadocs-mdx, tailwindcss, ...) that the builder
# needs below. Force a development install in this stage.
ENV NODE_ENV=development
COPY package.json package-lock.json* .npmrc* ./
RUN npm install --no-audit

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD sh -c "wget --no-verbose --tries=1 --spider http://127.0.0.1:8080/ || exit 1"
