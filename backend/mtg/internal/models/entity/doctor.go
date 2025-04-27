package entity

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type BaseDoctorFields struct {
	ID          *uuid.UUID `json:"id" gorm:"type:uuid;primaryKey"`
	FirstName   string     `json:"firstName"`
	LastName    string     `json:"lastName"`
	PhoneNumber *string    `json:"phoneNumber"`
	Notes       *string    `json:"notes"`
}

type DoctorRelationship struct {
	Works  *uuid.UUID `json:"works"`
	Clinic *Clinic    `gorm:"foreignKey:Works;references:ID"`
	Owner  string     `json:"owner"`
}

type Doctor struct {
	BaseDoctorFields
	DoctorRelationship
}

func (d *Doctor) BeforeCreate(tx *gorm.DB) error {
	if d.ID == nil {
		id := uuid.New()
		d.ID = &id
	}
	return nil
}
