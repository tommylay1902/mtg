package dService

import (
	"mtg/internal/models/entity"
	dDao "mtg/internal/server/dao/doctor"

	"github.com/google/uuid"
)

type FiberDoctorService struct {
	DAO dDao.DoctorDAO
}

func InitializeFiberDoctorService(dao dDao.DoctorDAO) *FiberDoctorService {
	return &FiberDoctorService{DAO: dao}
}

func (service *FiberDoctorService) CreateDoctor(model *entity.Doctor) (*uuid.UUID, error) {
	return service.DAO.CreateDoctor(model)
}

func (service *FiberDoctorService) GetDoctors(email *string) ([]entity.Doctor, error) {
	return service.DAO.GetDoctors(email)
}
