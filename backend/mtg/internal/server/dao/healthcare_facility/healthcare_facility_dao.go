package hcDao

import (
	"mtg/internal/models/entity"

	"github.com/google/uuid"
)

type HealthCareFacilityDao interface {
	CreateHealthCareFacility(entity.HealthCareFacility) (*uuid.UUID, error)
	CreateHealthCareFacilityWithLocation(entity.HealthCareFacility, entity.Location) (*uuid.UUID, error)
	GetAll(*string) ([]entity.HealthCareFacility, error)
	GetAllPharmacy(*string) ([]entity.HealthCareFacility, error)
}
