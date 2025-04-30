package handler

import (
	"mtg/internal/error/apperror"
	"mtg/internal/error/errorhandler"
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
	email := c.Locals("email").(string)
	var bodyRequest entity.Clinic

	if err := c.BodyParser(&bodyRequest); err != nil {
		bodyParseErr := &apperror.BadRequestError{
			Message: err.Error(),
			Code:    400,
		}
		return errorhandler.HandleError(bodyParseErr, c)
	}

	bodyRequest.Owner = &email
	id, err := ch.Service.CreateClinic(bodyRequest)

	if err != nil {
		return errorhandler.HandleError(err, c)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": id,
	})
}

func (ch *ClinicHandler) GetAllClinics(c *fiber.Ctx) error {
	email := c.Locals("email").(string)

	clinics, err := ch.Service.GetAllClinics(&email)

	if err != nil {
		return errorhandler.HandleError(err, c)
	}
	
	return c.Status(fiber.StatusOK).JSON(clinics)
}
