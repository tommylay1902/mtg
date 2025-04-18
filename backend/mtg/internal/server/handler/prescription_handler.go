package handler

import (
	"fmt"
	"mtg/internal/error/apperror"
	"mtg/internal/error/errorhandler"
	dto "mtg/internal/models/dto/prescription"
	"mtg/internal/models/entity"
	"mtg/internal/models/request"
	service "mtg/internal/server/service/prescription"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type PrescriptionHandler struct {
	Service service.PrescriptionService
}

func InitializePrescriptionHandler(service service.PrescriptionService) *PrescriptionHandler {
	return &PrescriptionHandler{Service: service}
}

func (ph *PrescriptionHandler) CreatePrescription(c *fiber.Ctx) error {
	var requestBody dto.PrescriptionDTO
	email := c.Locals("email").(string)
	if err := c.BodyParser(&requestBody); err != nil {
		badErr := &apperror.BadRequestError{
			Message: err.Error(),
			Code:    400,
		}
		return errorhandler.HandleError(badErr, c)
	}

	requestBody.Owner = &email

	id, err := ph.Service.CreatePrescription(&requestBody)
	if err != nil {
		fmt.Println(err)
		return errorhandler.HandleError(err, c)
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": id.String(),
	})
}

func (ph *PrescriptionHandler) GetPrescription(c *fiber.Ctx) error {
	idParam := c.Params("id")
	email := c.Locals("email").(string)

	id, err := uuid.Parse(idParam)

	if err != nil {
		custErr := &apperror.BadRequestError{
			Message: err.Error(),
			Code:    400,
		}
		return errorhandler.HandleError(custErr, c)
	}

	p, sErr := ph.Service.GetPrescriptionById(id, email)

	if sErr != nil {
		return errorhandler.HandleError(sErr, c)
	}

	return c.Status(fiber.StatusOK).JSON(p)
}

func (ph *PrescriptionHandler) GetPrescriptions(c *fiber.Ctx) error {
	email := c.Locals("email").(string)
	searchQueries := c.Queries()
	prescriptions, err := ph.Service.GetPrescriptions(searchQueries, &email)

	if err != nil {
		return errorhandler.HandleError(err, c)
	}
	return c.Status(fiber.StatusOK).JSON(prescriptions)
}

func (ph *PrescriptionHandler) DeletePrescription(c *fiber.Ctx) error {
	idParam := c.Params("id")
	email := c.Params("email")
	id, err := uuid.Parse(idParam)

	if err != nil {
		badErr := &apperror.BadRequestError{
			Message: err.Error(),
			Code:    400,
		}
		return errorhandler.HandleError(badErr, c)
	}
	sErr := ph.Service.DeletePrescription(id, email)
	if sErr != nil {
		return errorhandler.HandleError(sErr, c)
	}
	return nil
}

func (ph *PrescriptionHandler) DeleteBatchPrescription(c *fiber.Ctx) error {
	email := c.Locals("email").(string)
	var requestBody request.DeleteBatchPrescriptionRequest
	if err := c.BodyParser(&requestBody); err != nil {
		bodyParseErr := &apperror.BadRequestError{
			Message: err.Error(),
			Code:    400,
		}
		return errorhandler.HandleError(bodyParseErr, c)
	}
	fmt.Println(requestBody.DeleteList)
	err := ph.Service.DeleteBatchPrescription(requestBody.DeleteList, email)

	if err != nil {
		fmt.Println(err)
		return errorhandler.HandleError(err, c)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": "successfully deleted all prescriptions",
	})
}

func (ph *PrescriptionHandler) UpdatePrescription(c *fiber.Ctx) error {
	idParam := c.Params("id")
	email := c.Params("email")
	id, err := uuid.Parse(idParam)

	if err != nil {
		badErr := &apperror.BadRequestError{
			Message: err.Error(),
			Code:    400,
		}
		return errorhandler.HandleError(badErr, c)
	}

	var requestBody dto.PrescriptionDTO
	if err := c.BodyParser(&requestBody); err != nil {
		bodyParseErr := &apperror.BadRequestError{
			Message: err.Error(),
			Code:    400,
		}
		return errorhandler.HandleError(bodyParseErr, c)
	}

	sErr := ph.Service.UpdatePrescription(&requestBody, id, email)

	if sErr != nil {
		return errorhandler.HandleError(sErr, c)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": "successfully updated prescription",
	})
}

func (ph *PrescriptionHandler) UpdateBatchPrescription(c *fiber.Ctx) error {
	email := c.Locals("email").(string)

	var requestBody []entity.Prescription
	fmt.Println("we are in here")

	if err := c.BodyParser(&requestBody); err != nil {
		fmt.Println(err)
		bodyParseErr := &apperror.BadRequestError{
			Message: err.Error(),
			Code:    400,
		}
		return errorhandler.HandleError(bodyParseErr, c)
	}

	for _, e := range requestBody {
		e.Owner = &email
	}

	err := ph.Service.UpdateBatchPrescription(requestBody, email)

	if err != nil {
		fmt.Println(err)
		return errorhandler.HandleError(err, c)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": "successfully all prescriptions",
	})

}
