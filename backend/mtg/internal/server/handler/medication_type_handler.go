package handler

import (
	dto "mtg/internal/models/dto/medication_type"
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
	var bodyRequest dto.MedicationType

	if err := c.BodyParser(&bodyRequest); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error,
		})
	}
	id, err := mtHandler.Service.CreateMedicationType(&bodyRequest)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": id,
		})
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": id,
	})
}

func (mtHandler *MedicationTypeHandler) GetMedicationTypes(c *fiber.Ctx) error {
	medicationTypes, err := mtHandler.Service.GetMedicationTypes()

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Server Error",
		})
	}

	return c.Status(fiber.StatusOK).JSON(medicationTypes)
}
