package pService

import (
	"mtg/internal/error/apperror"

	"mtg/internal/models/entity"
	"mtg/internal/models/request"
	pDao "mtg/internal/server/dao/prescription"

	"github.com/google/uuid"
)

type FiberPrescriptionService struct {
	DAO pDao.PrescriptionDAO
}

func InitializeFiberPrescriptionService(dao pDao.PrescriptionDAO) *FiberPrescriptionService {
	return &FiberPrescriptionService{DAO: dao}
}

func (ps *FiberPrescriptionService) CreatePrescription(request *request.AddPrescriptionRequest) (*uuid.UUID, error) {

	model := entity.Prescription{
		BasePrescriptionFields: entity.BasePrescriptionFields{
			Medication: request.Medication,
			Dosage:     request.Dosage,
			Notes:      request.Notes,
			Started:    request.Started,
			Ended:      request.Ended,
			Refills:    request.Refills,
			Total:      request.Total,
			Owner:      request.Owner,
		},
		RelationshipPrescriptionFields: entity.RelationshipPrescriptionFields{
			MedicationTypes: request.MedicationType,
			PrescribedBy:    request.PrescribedBy,
		},
	}

	id, err := ps.DAO.CreatePrescription(model)

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

func (ps *FiberPrescriptionService) GetMedicationTypesByPrescriptionId(id uuid.UUID, email string) ([]entity.MedicationType, error) {
	prescription, err := ps.DAO.GetPrescriptionById(id, email)

	if err != nil {
		return nil, err
	}

	return ps.DAO.GetMedicationTypesByPrescriptionId(prescription)
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

func (ps *FiberPrescriptionService) UpdatePrescription(model *entity.Prescription, id uuid.UUID, email string) error {
	pUpdate, err := ps.DAO.GetPrescriptionById(id, email)
	if err != nil {
		return err
	}
	hasUpdate := false
	if model.Dosage != pUpdate.Dosage {
		hasUpdate = true
		pUpdate.Dosage = model.Dosage
	}

	if model.Medication != pUpdate.Medication {
		hasUpdate = true
		pUpdate.Medication = model.Medication
	}

	if model.Notes != nil && *model.Notes != *pUpdate.Notes {
		hasUpdate = true
		*pUpdate.Notes = *model.Notes
	}

	if model.Started != nil && *model.Started != *pUpdate.Started {
		hasUpdate = true
		*pUpdate.Started = *model.Started
	}

	if pUpdate.Ended == nil && model.Ended != nil || model.Ended == nil && pUpdate.Ended != nil {
		hasUpdate = true
		pUpdate.Ended = model.Ended
	} else if pUpdate.Ended != nil && model.Ended != nil && *pUpdate.Ended != *model.Ended {
		hasUpdate = true
		*pUpdate.Ended = *model.Ended
	}

	if pUpdate.Refills != nil && *model.Refills != *pUpdate.Refills {
		hasUpdate = true
		*pUpdate.Refills = *model.Refills
	}

	if hasUpdate {
		return ps.DAO.UpdatePrescription(pUpdate, email)
	}

	return &apperror.BadRequestError{Message: "No updates found for the prescription", Code: 400}
}

func (ps *FiberPrescriptionService) UpdateBatchPrescription(updateList []entity.Prescription, email string) error {
	return ps.DAO.UpdateBatchPrescription(updateList, email)
}
