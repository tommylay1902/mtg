package handler

import (
	"log"
	"mtg/internal/error/errorhandler"
	"mtg/internal/models/entity"

	service "mtg/internal/server/service/prescriptionhistory"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type PrescriptionHistoryHandler struct {
	Service service.PrescriptionHistoryService
}

func InitializePrescriptionHistoryHandler(service service.PrescriptionHistoryService) *PrescriptionHistoryHandler {
	return &PrescriptionHistoryHandler{Service: service}
}

func (h *PrescriptionHistoryHandler) CreatePrescriptionHistory(c *fiber.Ctx) error {
	var request entity.PrescriptionHistory
	err := c.BodyParser(&request)

	if err != nil {
		log.Panic(err)
	}

	id, err := h.Service.CreatePrescriptionHistory(&request)

	if err != nil {
		return errorhandler.HandleError(err, c)
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"success": id.String()})
}

func (h *PrescriptionHistoryHandler) GetAll(c *fiber.Ctx) error {
	searchQueries := c.Queries()
	email := c.Params("email")
	result, err := h.Service.GetAll(searchQueries, email)

	if err != nil {
		return errorhandler.HandleError(err, c)
	}

	return c.Status(fiber.StatusOK).JSON(result)
}

func (h *PrescriptionHistoryHandler) GetByEmailAndRx(c *fiber.Ctx) error {
	email := c.Params("email")
	idParam := c.Params("pId")

	pId, err := uuid.Parse(idParam)

	if err != nil {

		return errorhandler.HandleError(err, c)
	}
	result, sErr := h.Service.GetByEmailAndRx(email, pId)

	if sErr != nil {

		return errorhandler.HandleError(sErr, c)
	}

	return c.Status(fiber.StatusOK).JSON(result)
}

func (h *PrescriptionHistoryHandler) DeleteByEmailAndRx(c *fiber.Ctx) error {
	email := c.Params("email")
	idParam := c.Params("pId")

	pId, err := uuid.Parse(idParam)

	if err != nil {
		return errorhandler.HandleError(err, c)
	}

	sErr := h.Service.DeleteByEmailAndRx(email, pId)

	if sErr != nil {
		return errorhandler.HandleError(sErr, c)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"success": "succesfully deleted prescription history"})
}

func (h *PrescriptionHistoryHandler) UpdateByEmailAndRx(c *fiber.Ctx) error {
	email := c.Params("email")
	idParam := c.Params("pId")
	pId, err := uuid.Parse(idParam)

	if err != nil {
		return errorhandler.HandleError(err, c)
	}

	model := &entity.PrescriptionHistory{}

	err = c.BodyParser(&model)

	if err != nil {

		return errorhandler.HandleError(err, c)
	}

	err = h.Service.UpdateByEmailAndRx(model, email, pId)

	if err != nil {
		return errorhandler.HandleError(err, c)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"success": "succesfully updated!"})
}
