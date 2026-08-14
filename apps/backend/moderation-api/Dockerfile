# ---- Build stage ----
FROM node:24-bookworm-slim AS build

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy workspace manifests first for layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps ./apps

RUN pnpm install --frozen-lockfile

# Build the shared workspace packages consumed at runtime (dependency order matters)
RUN pnpm --filter @utils/shared run build && \
    pnpm --filter @contract/moderation run build

# ---- Runtime stage ----
FROM node:24-bookworm-slim AS runtime

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV=production
RUN corepack enable

WORKDIR /app
COPY --from=build /app ./

EXPOSE 3000
CMD ["pnpm", "--filter", "@/backend/moderation", "exec", "tsx", "src/index.ts"]
