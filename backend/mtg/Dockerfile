FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY go.mod ./
COPY go.sum ./

COPY . ./

RUN go build -o /api ./cmd/api

EXPOSE 8080

CMD [ "/api"]
