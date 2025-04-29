package entity

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type BaseMedicationFields struct {
	ID            *uuid.UUID     `json:"id" gorm:"type:uuid;primaryKey"`
	Type          string         `json:"type"`
	Prescriptions []Prescription `json:"-" gorm:"constraint:OnDelete:CASCADE;many2many:prescription_medication_types"`
	Color         string         `json:"color" gorm:"default:'#0000FF'"`
	Owner         string         `json:"owner"`
}

type MedicationType struct {
	BaseMedicationFields
}

func (mt *MedicationType) BeforeCreate(tx *gorm.DB) error {
	if mt.ID == nil {
		id := uuid.New()
		mt.ID = &id
	}
	return nil
}
