package main

import (
	"fmt"
	"mtg/internal/server"
	"mtg/internal/server/middleware"
	"os"
	"strconv"

	"github.com/Nerzal/gocloak/v13"
	"github.com/gofiber/fiber/v2/middleware/cors"
	_ "github.com/joho/godotenv/autoload"
)

func main() {
	server := server.New()
	server.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "*",
	}))
	clientName := os.Getenv("KC_CLIENT")

	client := gocloak.NewClient(clientName)
	realm := os.Getenv("KC_REALM")
	clientID := os.Getenv("KC_CLIENT_ID")
	clientSecret := os.Getenv("KC_CLIENT_SECRET")
	keycloakMiddleWare := middleware.VerifyValidTokenMiddleware(client, realm, clientID, clientSecret)
	jwtMiddleware := middleware.JwtMiddleware(clientName, realm)

	server.RegisterFiberRoutes(keycloakMiddleWare, jwtMiddleware)
	port, _ := strconv.Atoi(os.Getenv("PORT"))
	err := server.Listen(fmt.Sprintf(":%d", port))
	if err != nil {
		panic(fmt.Sprintf("cannot start server: %s", err))
	}
}
