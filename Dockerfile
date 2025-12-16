FROM node:18-bullseye-slim AS builder
WORKDIR /app

# Build args used to provide NEXT_PUBLIC_* and other envs at build time
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_FRONTEND_API
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_LIVEKIT_URL

# install deps (including dev deps for prisma CLI)
COPY package.json package-lock.json* ./
# install dependencies (prefer offline, skip audits to speed up builds in CI/Docker)
RUN npm ci --no-audit --prefer-offline --no-fund --unsafe-perm

# copy sources
COPY . .

# expose build-time envs to the build process so Next.js inlines NEXT_PUBLIC_* vars
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
ENV CLERK_FRONTEND_API=${CLERK_FRONTEND_API}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_PUBLIC_LIVEKIT_URL=${NEXT_PUBLIC_LIVEKIT_URL}

# generate prisma client and build Next app
RUN npx prisma generate
RUN npm run build

FROM node:18-bullseye-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# copy built artifacts and node_modules (including prisma CLI)
# copy built artifacts and node_modules (including prisma CLI)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# copy entrypoint
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

# ensure OpenSSL and CA certs are present for Prisma
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["npm","start"]
