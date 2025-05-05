package hcService

import (
	"mtg/internal/models/entity"
	hcDao "mtg/internal/server/dao/healthcare_facility"

	"github.com/google/uuid"
)

type FiberHealthCareFacilityService struct {
	DAO hcDao.HealthCareFacilityDao
}

func InitializeFiberHealthCareFacilityervice(dao hcDao.HealthCareFacilityDao) *FiberHealthCareFacilityService {
	return &FiberHealthCareFacilityService{DAO: dao}
}

func (s *FiberHealthCareFacilityService) CreateHealthCareFacility(model entity.HealthCareFacility) (*uuid.UUID, error) {
	return s.DAO.CreateHealthCareFacility(model)
}

func (s *FiberHealthCareFacilityService) CreateHealthCareFacilityWithLocation(hc entity.HealthCareFacility, loc entity.Location) (*uuid.UUID, error) {
	return s.DAO.CreateHealthCareFacilityWithLocation(hc, loc)
}

func (s *FiberHealthCareFacilityService) GetAllHealthCareFacility(owner *string) ([]entity.HealthCareFacility, error) {
	return s.DAO.GetAll(owner)
}

func (s *FiberHealthCareFacilityService) GetAllPharmacy(owner *string) ([]entity.HealthCareFacility, error) {
	return s.DAO.GetAllPharmacy(owner)
}
