package entity

import (
	"github.com/google/uuid"
)

type Doctor struct {
	ID             uuid.UUID  `json:"id" gorm:"type:uuid;primaryKey"`
	FirstName      string     `json:"firstName"`
	LastName       string     `json:"lastName"`
	PhoneNumber    *string    `json:"phoneNumber"`
	ClinicLocation *uuid.UUID `json:"clinicLocation"`
	Clinic         *Clinic    `gorm:"foreignKey:ClinicLocation;references:ID"`
}
