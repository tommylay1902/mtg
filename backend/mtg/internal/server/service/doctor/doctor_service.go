package dService

import (
	"mtg/internal/models/entity"

	"github.com/google/uuid"
)

type DoctorService interface {
	CreateDoctor(*entity.Doctor) (*uuid.UUID, error)
	GetDoctors(*string) ([]entity.Doctor, error)
}
