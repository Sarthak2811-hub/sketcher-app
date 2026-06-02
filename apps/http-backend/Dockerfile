# Stage 1: Build the application
FROM node:20-alpine AS builder
RUN apk add --no-cache openssl
RUN npm install -g pnpm@10.18.0
WORKDIR /app

# Copy lockfiles and workspace configuration
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json turbo.json tsconfig.json ./
COPY .npmrc* ./

# Copy all packages and the http-backend source
COPY packages/ ./packages/
COPY apps/http-backend/ ./apps/http-backend/

# Install dependencies and build http-backend and its local dependencies
RUN pnpm install --frozen-lockfile
RUN pnpm --filter http-backend... build

# Stage 2: Run the application
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
RUN npm install -g pnpm@10.18.0 prisma@5.22.0
WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY .npmrc* ./
COPY packages/ ./packages/
COPY apps/http-backend/ ./apps/http-backend/

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy the built JS files from the builder stage
COPY --from=builder /app/apps/http-backend/dist ./apps/http-backend/dist
COPY --from=builder /app/packages/db/dist ./packages/db/dist
COPY --from=builder /app/packages/db/generated ./packages/db/generated
COPY --from=builder /app/packages/backend-common/dist ./packages/backend-common/dist
COPY --from=builder /app/packages/common/dist ./packages/common/dist

# Copy prisma schema (needed by prisma db push at runtime) and startup script
COPY --from=builder /app/packages/db/prisma ./packages/db/prisma
COPY apps/http-backend/start.sh ./start.sh
RUN chmod +x ./start.sh

EXPOSE 3002
CMD ["sh", "./start.sh"]
