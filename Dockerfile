FROM node:20.10.0@sha256:8d0f16fe841577f9317ab49011c6d819e1fa81f8d4af7ece7ae0ac815e07ac84

RUN wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.5/dumb-init_1.2.5_x86_64
RUN chmod +x /usr/local/bin/dumb-init
WORKDIR /usr/src/app

COPY pnpm-lock.yaml package.json ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY ./src ./src
RUN pnpm build

COPY --chown=node:node . .
EXPOSE 3000:3000
USER node
CMD ["dumb-init", "node", "dist/server.js"]
