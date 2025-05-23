package dDao

import (
	"mtg/internal/models/entity"

	"github.com/google/uuid"
)

type DoctorDAO interface {
	CreateDoctor(*entity.Doctor) (*uuid.UUID, error)
	GetDoctors(*string) ([]entity.Doctor, error)
}
