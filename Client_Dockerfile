FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package.json .

RUN yarn
COPY . .

RUN yarn build
RUN npm install -g serve