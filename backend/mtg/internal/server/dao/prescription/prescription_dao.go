package pDao

import (
	"mtg/internal/models/entity"

	"github.com/google/uuid"
)

type PrescriptionDAO interface {
	CreatePrescription(model entity.Prescription) (*uuid.UUID, error)
	GetPrescriptionById(id uuid.UUID, email string) (*entity.Prescription, error)
	GetAllPrescriptions(searchQueries map[string]string, email *string) ([]entity.Prescription, error)
	DeletePrescription(model *entity.Prescription, email string) error
	DeleteBatchPrescription(deleteList []uuid.UUID, email string) error
	UpdatePrescription(model *entity.Prescription, email string) error
	UpdateBatchPrescription(updateList []entity.Prescription, email string) error
}
