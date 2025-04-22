package cDao

import (
	"mtg/internal/models/entity"

	"github.com/google/uuid"
)

type ClinicDAO interface {
	CreateClinic(entity.Clinic) (*uuid.UUID, error)
}
