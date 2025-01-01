package pService

import (
	"fmt"
	"mtg/internal/error/apperror"
	pDto "mtg/internal/models/dto/prescription"
	"mtg/internal/models/entity"
	pDao "mtg/internal/server/dao/prescription"

	"github.com/google/uuid"
)

type FiberPrescriptionService struct {
	DAO pDao.PrescriptionDAO
}

func InitializeFiberPrescriptionService(dao pDao.PrescriptionDAO) *FiberPrescriptionService {
	return &FiberPrescriptionService{DAO: dao}
}

func (ps *FiberPrescriptionService) CreatePrescription(pDTO *pDto.PrescriptionDTO) (*uuid.UUID, error) {
	create, dtoErr := pDto.MapPrescriptionDTOToEntity(pDTO)

	if dtoErr != nil {
		fmt.Println("error was hit here with dto mapping")
		return nil, dtoErr
	}

	id, err := ps.DAO.CreatePrescription(create)

	if err != nil {
		return nil, err
	}

	return id, nil
}

func (ps *FiberPrescriptionService) GetPrescriptionById(id uuid.UUID, email string) (*entity.Prescription, error) {
	p, err := ps.DAO.GetPrescriptionById(id, email)
	if err != nil {
		return nil, err
	}
	return p, nil
}

func (ps *FiberPrescriptionService) GetPrescriptions(searchQuery map[string]string, owner *string) ([]entity.Prescription, error) {
	prescriptions, err := ps.DAO.GetAllPrescriptions(searchQuery, owner)

	if err != nil {
		return nil, err
	}

	return prescriptions, nil
}

func (ps *FiberPrescriptionService) DeletePrescription(id uuid.UUID, email string) error {
	prescription, err := ps.DAO.GetPrescriptionById(id, email)
	if err != nil {
		return &apperror.ResourceNotFound{
			Message: err.Error(),
			Code:    404,
		}
	}
	daoError := ps.DAO.DeletePrescription(prescription, email)
	if daoError != nil {
		return daoError
	}
	return nil
}

func (ps *FiberPrescriptionService) DeleteBatchPrescription(deleteList []uuid.UUID, email string) error {
	err := ps.DAO.DeleteBatchPrescription(deleteList, email)

	if err != nil {
		return err
	}

	return nil
}

func (ps *FiberPrescriptionService) UpdatePrescription(pDTO *pDto.PrescriptionDTO, id uuid.UUID, email string) error {
	pUpdate, err := ps.DAO.GetPrescriptionById(id, email)
	if err != nil {
		return err
	}
	hasUpdate := false
	if pDTO.Dosage != nil && *pDTO.Dosage != *pUpdate.Dosage {
		hasUpdate = true
		*pUpdate.Dosage = *pDTO.Dosage
	}

	if pDTO.Medication != nil && *pDTO.Medication != *pUpdate.Medication {
		hasUpdate = true
		*pUpdate.Medication = *pDTO.Medication
	}

	if pDTO.Notes != nil && *pDTO.Notes != *pUpdate.Notes {
		hasUpdate = true
		*pUpdate.Notes = *pDTO.Notes
	}

	if pDTO.Started != nil && *pDTO.Started != *pUpdate.Started {
		hasUpdate = true
		*pUpdate.Started = *pDTO.Started
	}

	if pUpdate.Ended == nil && pDTO.Ended != nil || pDTO.Ended == nil && pUpdate.Ended != nil {
		hasUpdate = true
		pUpdate.Ended = pDTO.Ended
	} else if pUpdate.Ended != nil && pDTO.Ended != nil && *pUpdate.Ended != *pDTO.Ended {
		hasUpdate = true
		*pUpdate.Ended = *pDTO.Ended
	}

	if pUpdate.Refills != nil && *pDTO.Refills != *pUpdate.Refills {
		hasUpdate = true
		*pUpdate.Refills = *pDTO.Refills
	}

	if hasUpdate {
		return ps.DAO.UpdatePrescription(pUpdate, email)
	}

	return &apperror.BadRequestError{Message: "No updates found for the prescription", Code: 400}
}

func (ps *FiberPrescriptionService) UpdateBatchPrescription(updateList []entity.Prescription, email string) error {
	return ps.DAO.UpdateBatchPrescription(updateList, email)
}
