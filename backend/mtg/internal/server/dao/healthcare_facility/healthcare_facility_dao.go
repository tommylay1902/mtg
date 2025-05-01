package hcDao

import (
	"mtg/internal/models/entity"

	"github.com/google/uuid"
)

type HealthCareFacilityDao interface {
	CreateHealthCareFacility(entity.HealthCareFacility) (*uuid.UUID, error)
	GetAll(*string) ([]entity.HealthCareFacility, error)
}
