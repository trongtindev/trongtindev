# base
FROM node:23-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NITRO_PRESET=node
COPY . .
RUN corepack enable

## prod-deps
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

## build
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

## runtime
FROM base AS runtime

COPY --from=build /app/.output ./.
RUN apk add --no-cache curl

CMD ["node", "/app/server/index.mjs"]
