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
	Works  *uuid.UUID `json:"works"`
	Clinic *Clinic    `gorm:"foreignKey:Works;references:ID"`
}

type Doctor struct {
	BaseDoctorFields
	DoctorRelationship
}
