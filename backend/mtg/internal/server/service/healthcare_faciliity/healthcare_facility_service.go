package hcService

import (
	"mtg/internal/models/entity"

	"github.com/google/uuid"
)

type HealthCareFacilityService interface {
	CreateHealthCareFacility(entity.HealthCareFacility) (*uuid.UUID, error)
	GetAllHealthCareFacility(*string) ([]entity.HealthCareFacility, error)
	GetAllPharmacy(*string) ([]entity.HealthCareFacility, error)
}
