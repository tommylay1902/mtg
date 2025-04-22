package cService

import (
	"mtg/internal/models/entity"
	cDao "mtg/internal/server/dao/clinic"

	"github.com/google/uuid"
)

type FiberClinicService struct {
	DAO cDao.ClinicDAO
}

func InitializeFiberClinicService(dao cDao.ClinicDAO) *FiberClinicService {
	return &FiberClinicService{DAO: dao}
}

func (s *FiberClinicService) CreateClinic(model entity.Clinic) (*uuid.UUID, error) {
	return nil, nil
}
