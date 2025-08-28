# base
FROM node:23-alpine AS base
WORKDIR /app
ENV TZ="Asia/Ho_Chi_Minh"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
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

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
RUN npm install -g http-server
RUN apk add --no-cache curl

CMD [ "http-server", "dist" ]
