package mtService

import (
	dto "mtg/internal/models/dto/medication_type"

	"github.com/google/uuid"
)

type MedicationTypeService interface {
	CreateMedicationType(medicationType *dto.MedicationType) (*uuid.UUID, error)
}
