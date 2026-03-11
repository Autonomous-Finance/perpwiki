# --- Builder ---
FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache python3 make g++ libstdc++
RUN npm install -g pnpm@10
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY prisma ./prisma
RUN pnpm db:generate
COPY . .
# Create empty DB for build-time SSG
ENV DATABASE_URL=file:./prisma/dev.db
RUN pnpm exec prisma migrate deploy
RUN --mount=type=cache,target=/app/.next/cache pnpm build

# --- Runner ---
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4001
ENV HOSTNAME=0.0.0.0
EXPOSE 4001
RUN apk add --no-cache libstdc++ sqlite && \
    wget -q -O /tmp/litestream.tar.gz https://github.com/benbjohnson/litestream/releases/download/v0.5.9/litestream-v0.5.9-linux-amd64.tar.gz && \
    tar -xzf /tmp/litestream.tar.gz -C /usr/local/bin litestream && \
    rm /tmp/litestream.tar.gz
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma/dev.db ./seed.db
COPY --from=builder /app/litestream.yml ./litestream.yml
COPY --from=builder /app/docker-entrypoint.sh ./docker-entrypoint.sh
RUN mkdir -p /data && chown nextjs:nodejs /data
RUN chown -R nextjs:nodejs /app/.next
RUN chmod +x ./docker-entrypoint.sh
USER nextjs
ENTRYPOINT ["./docker-entrypoint.sh"]
