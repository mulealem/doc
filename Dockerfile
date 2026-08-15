# syntax=docker/dockerfile:1
#
# PyGate developer docs — Fumadocs + MDX, Next.js 16.
#
# Recommended deploy target is the Coolify **Static Site** resource type
# (Build Command `npm run build`, Publish Directory `out`, Node version
# ignored). This Dockerfile is provided as a fallback if you need SSR or
# a containerised static-serve. Coolify terminates TLS, so no nginx layer
# is bundled.

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* .npmrc* ./
RUN npm ci

FROM deps AS builder
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3003

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/.next/standalone/server.js ./server.js
COPY --from=builder /app/.next/standalone/.next ./.next
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs
EXPOSE 3003

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD sh -c "wget --no-verbose --tries=1 --spider http://localhost:${PORT:-3003}/ || exit 1"

ENTRYPOINT ["node", "server.js"]
