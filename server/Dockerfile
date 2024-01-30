FROM node:21-alpine

ARG PORT=8080

WORKDIR /home/app

COPY package*.json ./

COPY ./src ./src

COPY --from=ghcr.io/ufoscout/docker-compose-wait:latest /wait /wait

RUN chmod +x /wait

RUN npm install

EXPOSE $PORT

ENTRYPOINT /wait && node ./src/index.js
