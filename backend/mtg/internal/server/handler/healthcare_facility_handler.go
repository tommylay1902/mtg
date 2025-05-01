package handler

import (
	"mtg/internal/error/apperror"
	"mtg/internal/error/errorhandler"
	"mtg/internal/models/entity"
	hcService "mtg/internal/server/service/healthcare_faciliity"

	"github.com/gofiber/fiber/v2"
)

type HealthCareFacilityHandler struct {
	Service hcService.HealthCareFacilityService
}

func InitializeClinicHandler(service hcService.HealthCareFacilityService) *HealthCareFacilityHandler {
	return &HealthCareFacilityHandler{Service: service}
}

func (hch *HealthCareFacilityHandler) CreateHealthCareFacility(c *fiber.Ctx) error {
	email := c.Locals("email").(string)
	var bodyRequest entity.HealthCareFacility

	if err := c.BodyParser(&bodyRequest); err != nil {
		bodyParseErr := &apperror.BadRequestError{
			Message: err.Error(),
			Code:    400,
		}
		return errorhandler.HandleError(bodyParseErr, c)
	}

	bodyRequest.Owner = &email
	id, err := hch.Service.CreateHealthCareFacility(bodyRequest)

	if err != nil {
		return errorhandler.HandleError(err, c)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": id,
	})
}

func (hch *HealthCareFacilityHandler) GetAllHealthCareFacility(c *fiber.Ctx) error {
	email := c.Locals("email").(string)

	clinics, err := hch.Service.GetAllHealthCareFacility(&email)

	if err != nil {
		return errorhandler.HandleError(err, c)
	}

	return c.Status(fiber.StatusOK).JSON(clinics)
}
