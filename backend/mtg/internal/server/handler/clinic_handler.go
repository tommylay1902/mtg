package handler

import (
	"mtg/internal/models/entity"
	cService "mtg/internal/server/service/clinic"

	"github.com/gofiber/fiber/v2"
)

type ClinicHandler struct {
	Service cService.ClinicService
}

func InitializeClinicHandler(service cService.ClinicService) *ClinicHandler {
	return &ClinicHandler{Service: service}
}

func (ch *ClinicHandler) CreateClinic(c *fiber.Ctx) error {
	var bodyRequest entity.Clinic
	if err := c.BodyParser(&bodyRequest); err != nil {
		return c.SendStatus(fiber.StatusBadGateway)
	}

	return c.SendStatus(fiber.StatusOK)
}
