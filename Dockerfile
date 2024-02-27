##### DEPENDENCIES

FROM --platform=linux/amd64 node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY prisma ./




COPY package.json pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

##### BUILDER

FROM --platform=linux/amd64 node:20-alpine AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY .env .env.production



RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi


# RUN \
#   if [ -f yarn.lock ]; then yarn run db:populate; \
#   elif [ -f package-lock.json ]; then npm run db:populate; \
#   elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run db:populate; \
#   else echo "Lockfile not found." && exit 1; \
#   fi


##### RUNNER

FROM --platform=linux/amd64 node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs

# EXPOSE 3000
# ENV PORT 3000
# ENV HOSTNAME 0.0.0.0

CMD ["node", "server.js"]


# docker run -p 3000:3000 -e NEXTAUTH_SECRET="fpyyR+/ppMGOVGzDnFhz7nzy2NtPTuckbaMLDU/yegQ=" -e DATABASE_URL="postgresql://db-user:1234@localhost:5800/allocation-db?schema=public" -e ID_KEY="tRz6ndzQXDVh6aY2" -e SERVER_URL="https://allocation-server.vercel.app" app