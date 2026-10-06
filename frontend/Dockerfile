# 1. Base Image
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 2. Dependencies
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm install --no-audit

# 3. Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time environment variables
ARG NEXT_PUBLIC_API_URL=/api
ARG INTERNAL_API_URL=http://backend:8000/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV INTERNAL_API_URL=$INTERNAL_API_URL
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# Cap memory and worker threads so Next.js build does not freeze server CPU/RAM
ENV NODE_OPTIONS="--max-old-space-size=1536"
ENV NEXT_BUILD_WORKERS=1

RUN npm run build

# 4. Production Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV INTERNAL_API_URL=http://backend:8000/api

# Don't run production container as root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set permissions for prerender cache
RUN mkdir .next && chown nextjs:nodejs .next

# Automatically leverage standalone output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
