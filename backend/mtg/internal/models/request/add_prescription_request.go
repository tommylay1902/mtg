package request

import (
	"mtg/internal/models/entity"
)

type AddPrescriptionRequest struct {
	entity.BasePrescriptionFields
	MedicationType []entity.MedicationType `json:"medicationType"`
}
