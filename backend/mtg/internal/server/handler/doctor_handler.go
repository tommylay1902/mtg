package handler

import (
	"mtg/internal/error/apperror"
	"mtg/internal/error/errorhandler"
	"mtg/internal/models/entity"
	dService "mtg/internal/server/service/doctor"

	"github.com/gofiber/fiber/v2"
)

type DoctorHandler struct {
	Service dService.DoctorService
}

func InitiliazeDoctorHandler(service dService.DoctorService) *DoctorHandler {
	return &DoctorHandler{Service: service}
}

func (dh *DoctorHandler) CreateDoctor(c *fiber.Ctx) error {
	email := c.Locals("email").(string)
	var doctor entity.Doctor
	if err := c.BodyParser(&doctor); err != nil {
		error := &apperror.BadRequestError{
			Message: err.Error(),
			Code:    400,
		}
		return errorhandler.HandleError(error, c)
	}

	doctor.Owner = email

	id, err := dh.Service.CreateDoctor(&doctor)

	if err != nil {
		return errorhandler.HandleError(err, c)

	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": id,
	})
}

func (dh *DoctorHandler) GetDoctors(c *fiber.Ctx) error {
	email := c.Locals("email").(string)
	doctors, err := dh.Service.GetDoctors(&email)

	if err != nil {
		error := apperror.BadRequestError{
			Message: err.Error(),
			Code:    400,
		}
		return errorhandler.HandleError(&error, c)
	}

	return c.Status(fiber.StatusOK).JSON(doctors)
}
