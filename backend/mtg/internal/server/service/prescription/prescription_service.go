package pService

import (
	dto "mtg/internal/models/dto/prescription"
	"mtg/internal/models/entity"
	"mtg/internal/models/request"

	"github.com/google/uuid"
)

type PrescriptionService interface {
	CreatePrescription(request *request.AddPrescriptionRequest) (*uuid.UUID, error)
	GetPrescriptionById(id uuid.UUID, email string) (*entity.Prescription, error)
	GetPrescriptions(searchQuery map[string]string, owner *string) ([]entity.Prescription, error)
	DeletePrescription(id uuid.UUID, email string) error
	DeleteBatchPrescription(deleteList []uuid.UUID, email string) error
	UpdatePrescription(pDTO *dto.PrescriptionDTO, id uuid.UUID, email string) error
	UpdateBatchPrescription(updateList []entity.Prescription, email string) error
}
