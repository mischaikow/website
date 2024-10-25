FROM node:20-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable


FROM base AS prod

WORKDIR /app
COPY pnpm-lock.yaml package.json /app
RUN pnpm install --frozen-lockfile

COPY . /app
RUN pnpm build


FROM base

RUN apk add dumb-init

WORKDIR /app

COPY --from=prod /app/node_modules /app/node_modules
COPY --from=prod /app/dist /app/dist
COPY ./src /app/src

COPY --chown=node:node . .
EXPOSE 3000:3000
USER node
CMD ["dumb-init", "node", "dist/server.js"]
