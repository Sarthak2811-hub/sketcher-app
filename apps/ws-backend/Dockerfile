# Stage 1: Build the application
FROM node:20-alpine AS builder
RUN apk add --no-cache openssl
RUN npm install -g pnpm@10.18.0
WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json turbo.json tsconfig.json ./
COPY .npmrc* ./

COPY packages/ ./packages/
COPY apps/ws-backend/ ./apps/ws-backend/

RUN pnpm install --frozen-lockfile
RUN pnpm --filter ws-backend... build

# Stage 2: Run the application
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
RUN npm install -g pnpm@10.18.0
WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY .npmrc* ./
COPY packages/ ./packages/
COPY apps/ws-backend/ ./apps/ws-backend/

RUN pnpm install --frozen-lockfile --prod

# Copy the built JS files from the builder stage
COPY --from=builder /app/apps/ws-backend/dist ./apps/ws-backend/dist
COPY --from=builder /app/packages/db/dist ./packages/db/dist
COPY --from=builder /app/packages/db/generated ./packages/db/generated
COPY --from=builder /app/packages/backend-common/dist ./packages/backend-common/dist

EXPOSE 8080
CMD ["node", "apps/ws-backend/dist/index.js"]
