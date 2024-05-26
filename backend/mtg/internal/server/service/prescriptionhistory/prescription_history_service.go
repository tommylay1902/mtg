package phService

import (
	dto "mtg/internal/models/dto/prescriptionhistory"
	"mtg/internal/models/entity"

	"github.com/google/uuid"
)

type PrescriptionHistoryService interface {
	CreatePrescriptionHistory(dto *dto.PrescriptionHistoryDTO) (*uuid.UUID, error)
	GetAll(searchQueries map[string]string, email string) ([]entity.PrescriptionHistory, error)
	GetByEmailAndRx(email string, pId uuid.UUID) (*entity.PrescriptionHistory, error)
	DeleteByEmailAndRx(email string, pId uuid.UUID) error
	UpdateByEmailAndRx(dto *dto.PrescriptionHistoryDTO, email string, pId uuid.UUID) error
}
