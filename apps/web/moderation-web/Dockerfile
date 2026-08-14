# ---- Build stage ----
FROM node:24-bookworm-slim AS build

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps ./apps

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @web/moderation run build

# ---- Runtime stage ----
FROM nginx:alpine

COPY --from=build /app/apps/web/moderation-web/dist /usr/share/nginx/html
COPY apps/web/moderation-web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
