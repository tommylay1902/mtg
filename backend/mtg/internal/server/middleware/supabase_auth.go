// middleware/supabase_auth.go
package middleware

import (
	"context"
	"os"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/nedpals/supabase-go"
)

func SupabaseProtected() fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Authorization header missing",
			})
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		if tokenString == authHeader {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Bearer token required",
			})
		}

		supabaseUrl := os.Getenv("SUPABASE_URL")
		supabaseAnonKey := os.Getenv("SUPABASE_ANON_KEY")
		client := supabase.CreateClient(supabaseUrl, supabaseAnonKey)

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		user, err := client.Auth.User(ctx, tokenString)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error":   "Invalid token",
				"details": err.Error(),
			})
		}

		c.Locals("email", user.Email)

		return c.Next()
	}
}
