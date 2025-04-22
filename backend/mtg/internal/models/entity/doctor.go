package entity

import (
	"github.com/google/uuid"
)

type BaseDoctorFields struct {
	ID          uuid.UUID `json:"id" gorm:"type:uuid;primaryKey"`
	FirstName   string    `json:"firstName"`
	LastName    string    `json:"lastName"`
	PhoneNumber *string   `json:"phoneNumber"`
}

type DoctorRelationship struct {
	ClinicLocation *uuid.UUID `json:"clinicLocation"`
	Clinic         *Clinic    `gorm:"foreignKey:ClinicLocation;references:ID"`
}

type Doctor struct {
	BaseDoctorFields
	DoctorRelationship
}
