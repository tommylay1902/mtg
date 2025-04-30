package handler

import (
	"mtg/internal/error/apperror"
	"mtg/internal/error/errorhandler"
	"mtg/internal/models/entity"
	mtService "mtg/internal/server/service/medication_type"

	"github.com/gofiber/fiber/v2"
)

type MedicationTypeHandler struct {
	Service mtService.MedicationTypeService
}

func InitializeMedicationTypeHandler(service mtService.MedicationTypeService) *MedicationTypeHandler {
	return &MedicationTypeHandler{Service: service}
}

func (mtHandler *MedicationTypeHandler) CreateMedicationType(c *fiber.Ctx) error {
	email := c.Locals("email").(string)
	var bodyRequest entity.MedicationType

	if err := c.BodyParser(&bodyRequest); err != nil {
		error := apperror.BadRequestError{
			Message: err.Error(),
			Code:    400,
		}
		return errorhandler.HandleError(&error, c)
	}

	bodyRequest.Owner = email
	id, err := mtHandler.Service.CreateMedicationType(&bodyRequest)

	if err != nil {
		return errorhandler.HandleError(err, c)
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": id,
	})
}

func (mtHandler *MedicationTypeHandler) GetMedicationTypes(c *fiber.Ctx) error {
	email := c.Locals("email").(string)
	medicationTypes, err := mtHandler.Service.GetMedicationTypes(&email)

	if err != nil {
		return errorhandler.HandleError(err, c)
	}

	return c.Status(fiber.StatusOK).JSON(medicationTypes)
}
