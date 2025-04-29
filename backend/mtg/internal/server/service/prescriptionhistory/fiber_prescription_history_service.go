package phService

import (
	"mtg/internal/error/apperror"

	"mtg/internal/models/entity"
	dao "mtg/internal/server/dao/prescription_history"

	"github.com/google/uuid"
)

type FiberPrescriptionHistoryService struct {
	DAO dao.PrescriptionHistoryDao
}

func InitializeFiberPrescriptionHistoryService(dao dao.PrescriptionHistoryDao) *FiberPrescriptionHistoryService {
	return &FiberPrescriptionHistoryService{DAO: dao}
}

func (phs *FiberPrescriptionHistoryService) CreatePrescriptionHistory(model *entity.PrescriptionHistory) (*uuid.UUID, error) {

	id, daoErr := phs.DAO.CreateHistory(model)

	return id, daoErr
}

func (phs *FiberPrescriptionHistoryService) GetAll(searchQueries map[string]string, email string) ([]entity.PrescriptionHistory, error) {
	result, err := phs.DAO.GetAll(searchQueries, email)

	if err != nil {
		return nil, err
	}

	return result, nil
}

func (phs *FiberPrescriptionHistoryService) GetByEmailAndRx(email string, pId uuid.UUID) (*entity.PrescriptionHistory, error) {
	result, err := phs.DAO.GetByEmailAndRx(email, pId)

	if err != nil {
		return nil, err
	}

	return result, err
}

func (phs *FiberPrescriptionHistoryService) DeleteByEmailAndRx(email string, id uuid.UUID) error {
	// result, err := phs.DAO.GetByEmailAndRx(email, id)

	err := phs.DAO.DeleteByEmailAndRx(email, id)

	return err
}

func (phs *FiberPrescriptionHistoryService) UpdateByEmailAndRx(dto *entity.PrescriptionHistory, email string, pId uuid.UUID) error {
	hasUpdate := false

	curr, err := phs.DAO.GetByEmailAndRx(email, pId)

	if err != nil {

		return err
	}

	if dto.Owner != nil && dto.Owner != curr.Owner {
		hasUpdate = true
		curr.Owner = dto.Owner
	}

	if dto.PrescriptionId != nil && dto.PrescriptionId != curr.PrescriptionId {
		hasUpdate = true
		curr.PrescriptionId = dto.PrescriptionId
	}

	if dto.Taken != nil && dto.Taken != curr.Taken {
		hasUpdate = true
		curr.Taken = dto.Taken
	}

	if hasUpdate {
		err := phs.DAO.UpdateByModel(curr)
		return err
	}

	return &apperror.BadRequestError{Message: "No updates found for the prescription", Code: 400}
}
