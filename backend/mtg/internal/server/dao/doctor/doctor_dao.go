package dDao

import "github.com/google/uuid"

type DoctorDAO interface {
	CreateDoctor() (*uuid.UUID, error)
}
