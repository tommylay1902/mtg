package mtService

import (
	"mtg/internal/models/entity"
	mtDao "mtg/internal/server/dao/medication_type"

	"github.com/google/uuid"
)

type FiberMedicationTypeService struct {
	DAO mtDao.MedicationTypeDAO
}

func InitializeFiberMedicationTypeService(DAO mtDao.MedicationTypeDAO) *FiberMedicationTypeService {
	return &FiberMedicationTypeService{DAO: DAO}
}

func (mts *FiberMedicationTypeService) CreateMedicationType(model *entity.MedicationType) (*uuid.UUID, error) {
	return mts.DAO.CreateMedicationType(model)
}

func (mts *FiberMedicationTypeService) GetMedicationTypes(owner *string) ([]entity.MedicationType, error) {
	return mts.DAO.GetMedicationTypes(owner)
}
