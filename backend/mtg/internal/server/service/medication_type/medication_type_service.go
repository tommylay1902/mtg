package mtService

import (
	dto "mtg/internal/models/dto/medication_type"
	"mtg/internal/models/entity"

	"github.com/google/uuid"
)

type MedicationTypeService interface {
	CreateMedicationType(medicationType *dto.MedicationType) (*uuid.UUID, error)
	GetMedicationTypes() ([]entity.MedicationType, error)
}
