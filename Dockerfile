FROM node:20-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

## Build stage
FROM base AS build

COPY pnpm-lock.yaml package.json /app
RUN pnpm install --frozen-lockfile

COPY ./src /app/src
RUN pnpm build

## Prod modules
FROM base AS prod-devs

COPY pnpm-lock.yaml package.json /app
RUN pnpm install --frozen-lockfile -P

## Run stage
FROM base

RUN apk add dumb-init

COPY --from=build --chown=node:node /app/dist /app/dist
COPY --from=prod-devs --chown=node:node /app/node_modules /app/node_modules
COPY --from=build --chown=node:node /app/package.json /app/package.json
COPY --from=build --chown=node:node /app/src/templates /app/src/templates
COPY --chown=node:node ./static /app/static

EXPOSE 3000:3000
USER node
CMD ["dumb-init", "node", "dist/server.js"]