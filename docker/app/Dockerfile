FROM node:12

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN ./aws/install

RUN apt-get update
RUN apt-get -y install jq

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
