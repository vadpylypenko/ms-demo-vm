FROM node:18.13.0-alpine3.16 as base

FROM base as int

RUN npm i -g @nestjs/cli
WORKDIR /usr/app
RUN nest new demo-vm -p npm