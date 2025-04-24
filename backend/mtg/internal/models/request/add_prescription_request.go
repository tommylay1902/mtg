package request

import (
	"mtg/internal/models/entity"

	"github.com/google/uuid"
)

type AddPrescriptionRequest struct {
	entity.BasePrescriptionFields
	MedicationType []entity.MedicationType `json:"medicationType"`
	PrescribedBy   *uuid.UUID              `json:"prescribedBy"`
}
