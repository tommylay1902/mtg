package middleware

import (
	"context"
	"fmt"
	"strings"

	"github.com/Nerzal/gocloak/v13"
	"github.com/gofiber/fiber/v2"
)

// verify the token is valid keycloak token
func VerifyValidTokenMiddleware(client *gocloak.GoCloak, realm, clientID, clientSecret string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		token := c.Get("Authorization")
		token = strings.TrimPrefix(token, "Bearer ")
		if token == "" {
			return fiber.NewError(fiber.StatusUnauthorized, "Token missing")
		}

		ctx := context.Background()

		introspectionResponse, err := client.RetrospectToken(ctx, token, clientID, clientSecret, realm)

		if err != nil {
			fmt.Println(err, " from verify middleware")
			return fiber.NewError(fiber.StatusUnauthorized, "err")
		}
		if !*introspectionResponse.Active {
			fmt.Println("invalid or expired token")
			return fiber.NewError(fiber.StatusUnauthorized, "Invalid or expired token")
		}

		return c.Next()
	}
}
