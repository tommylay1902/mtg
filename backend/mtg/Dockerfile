FROM golang:1.21.5 as build


WORKDIR /app

COPY go.mod ./
COPY go.sum ./

COPY . ./

RUN go build -o /api ./cmd/api

EXPOSE 8080

CMD [ "/api"]
