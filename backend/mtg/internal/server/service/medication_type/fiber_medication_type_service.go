package mtService

import (
	dto "mtg/internal/models/dto/medication_type"
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

func (mts *FiberMedicationTypeService) CreateMedicationType(mtDTO *dto.MedicationType) (*uuid.UUID, error) {
	model, err := dto.MapMedicationTypeDTOToEntity(mtDTO)
	if err != nil {
		return nil, err
	}
	id, err := mts.DAO.CreateMedicationType(model)

	return id, err
}

func (mts *FiberMedicationTypeService) GetMedicationTypes() ([]entity.MedicationType, error) {
	return mts.DAO.GetMedicationTypes()
}
