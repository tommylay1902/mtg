package pService

import (
	dto "mtg/internal/models/dto/prescription"
	"mtg/internal/models/entity"

	"github.com/google/uuid"
)

type PrescriptionService interface {
	CreatePrescription(pDTO *dto.PrescriptionDTO) (*uuid.UUID, error)
	GetPrescriptionById(id uuid.UUID, email string) (*entity.Prescription, error)
	GetPrescriptions(searchQuery map[string]string, owner *string) ([]entity.Prescription, error)
	DeletePrescription(id uuid.UUID, email string) error
	UpdatePrescription(pDTO *dto.PrescriptionDTO, id uuid.UUID, email string) error
}
