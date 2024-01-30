FROM golang:1.21.6-alpine AS build

ARG MYSQL_CONNECTION_STRING="user:password@tcp(localhost:3306)/twitter?multiStatements=true&parseTime=true"

ENV MYSQL_CONNECTION_STRING=$MYSQL_CONNECTION_STRING

COPY --from=ghcr.io/ufoscout/docker-compose-wait:latest /wait /wait

RUN chmod +x /wait

WORKDIR /app

COPY go* ./

COPY ./migrations ./migrations

COPY main.go .

RUN go mod download

RUN go build -o ./mysql-migrations main.go

ENTRYPOINT /wait && ./mysql-migrations -mysql-database-url=$MYSQL_CONNECTION_STRING
