package phService

import (
	"mtg/internal/models/entity"

	"github.com/google/uuid"
)

type PrescriptionHistoryService interface {
	CreatePrescriptionHistory(model *entity.PrescriptionHistory) (*uuid.UUID, error)
	GetAll(searchQueries map[string]string, email string) ([]entity.PrescriptionHistory, error)
	GetByEmailAndRx(email string, pId uuid.UUID) (*entity.PrescriptionHistory, error)
	DeleteByEmailAndRx(email string, pId uuid.UUID) error
	UpdateByEmailAndRx(model *entity.PrescriptionHistory, email string, pId uuid.UUID) error
}
