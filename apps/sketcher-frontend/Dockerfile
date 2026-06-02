# Stage 1: Build the application
FROM node:20-alpine AS builder
RUN npm install -g pnpm@10.18.0
WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json turbo.json tsconfig.json ./
COPY .npmrc* ./

COPY packages/ ./packages/
COPY apps/sketcher-frontend/ ./apps/sketcher-frontend/

RUN pnpm install --frozen-lockfile

# Pass public env vars at build time (Next.js bakes these into the static files)
ARG NEXT_PUBLIC_HTTP_BACKEND=http://localhost:3002
ARG NEXT_PUBLIC_WS_URL=ws://localhost:8080
ENV NEXT_PUBLIC_HTTP_BACKEND=$NEXT_PUBLIC_HTTP_BACKEND
ENV NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL

RUN pnpm --filter sketcher-frontend build

# Stage 2: Run the application
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Next.js standalone mode output files
COPY --from=builder /app/apps/sketcher-frontend/.next/standalone ./
COPY --from=builder /app/apps/sketcher-frontend/.next/static ./apps/sketcher-frontend/.next/static
COPY --from=builder /app/apps/sketcher-frontend/public ./apps/sketcher-frontend/public

EXPOSE 3003
ENV PORT=3003
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/sketcher-frontend/server.js"]
