package mtDao

import (
	"mtg/internal/models/entity"

	"github.com/google/uuid"
)

type MedicationTypeDAO interface {
	CreateMedicationType(*entity.MedicationType) (*uuid.UUID, error)
	GetMedicationTypes(*string) ([]entity.MedicationType, error)
}
