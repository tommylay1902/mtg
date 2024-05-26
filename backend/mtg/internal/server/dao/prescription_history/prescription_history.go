package phDao

import (
	"mtg/internal/models/entity"

	"github.com/google/uuid"
)

type PrescriptionHistoryDao interface {
	CreateHistory(model *entity.PrescriptionHistory) (*uuid.UUID, error)
	GetAll(searchQueries map[string]string, owner string) ([]entity.PrescriptionHistory, error)
	GetByEmailAndRx(email string, pId uuid.UUID) (*entity.PrescriptionHistory, error)
	DeleteByEmailAndRx(email string, pId uuid.UUID) error
	UpdateByModel(updatedRx *entity.PrescriptionHistory) error
}
