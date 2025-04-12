package main

import (
	"fmt"
	"mtg/internal/server"
	"os"
	"strconv"

	"github.com/gofiber/fiber/v2/middleware/cors"
	_ "github.com/joho/godotenv/autoload"
)

func main() {
	server := server.New()
	server.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "*",
	}))

	server.RegisterFiberRoutes()
	port, _ := strconv.Atoi(os.Getenv("PORT"))
	err := server.Listen(fmt.Sprintf(":%d", port))
	if err != nil {
		panic(fmt.Sprintf("cannot start server: %s", err))
	}
}
