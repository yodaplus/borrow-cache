FROM node:12

EXPOSE 3001

COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

WORKDIR /app

RUN yarn --no-progress --non-interactive --frozen-lockfile

COPY ./abis/ /app/abis
COPY ./src/ /app/src
COPY ./scripts /app/scripts

COPY ./config.d.ts /app/config.d.ts
COPY ./loadenv.js /app/loadenv.js
COPY ./tsconfig.json /app/tsconfig.json
