package middleware

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

type UserInfo struct {
	Email string `json:"email"`
}

func JwtMiddleware(client string, realm string) fiber.Handler {
	return func(c *fiber.Ctx) error {

		url := fmt.Sprintf("%v/realms/%v/protocol/openid-connect/userinfo", client, realm)
		token := c.Get("Authorization")

		req, err := http.NewRequest("GET", url, nil)
		if err != nil {
			fmt.Println(err)
			return fiber.NewError(fiber.StatusUnauthorized, "err")
		}

		req.Header.Set("Authorization", token)
		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			fmt.Println(err)
			return fiber.NewError(fiber.StatusUnauthorized, "err")
		}
		defer resp.Body.Close()

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			fmt.Println(err)
			return fiber.NewError(fiber.StatusUnauthorized, "err")
		}

		var userInfo UserInfo
		if err := json.Unmarshal(body, &userInfo); err != nil {
			fmt.Println(err)
			return fiber.NewError(fiber.StatusUnauthorized, "err")
		}

		c.Locals("email", userInfo.Email)

		return c.Next()
	}

}
