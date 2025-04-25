package mtService

import (
	"mtg/internal/models/entity"

	"github.com/google/uuid"
)

type MedicationTypeService interface {
	CreateMedicationType(medicationType *entity.MedicationType) (*uuid.UUID, error)
	GetMedicationTypes(*string) ([]entity.MedicationType, error)
}
