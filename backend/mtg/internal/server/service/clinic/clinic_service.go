package cService

import (
	"mtg/internal/models/entity"

	"github.com/google/uuid"
)

type ClinicService interface {
	CreateClinic(entity.Clinic) (*uuid.UUID, error)
}
