package entity

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type BasePrescriptionFields struct {
	ID         *uuid.UUID `json:"id" gorm:"type:uuid;primaryKey"`
	Medication string     `json:"medication"`
	Dosage     string     `json:"dosage"`
	Notes      *string    `json:"notes"`
	Started    *time.Time `json:"started" gorm:"type:timestamp;"`
	Ended      *time.Time `json:"ended" gorm:"type:timestamp;"`
	Refills    *int       `json:"refills"`
	Total      *int       `json:"total" gorm:"type:SMALLINT;default:0"`
	Owner      *string    `json:"owner"`
}

func (b *BasePrescriptionFields) BeforeCreate(tx *gorm.DB) error {
	if b.ID == nil {
		id := uuid.New()
		b.ID = &id
	}
	return nil
}

func (p *Prescription) BeforeCreate(tx *gorm.DB) error {
	if p.ID == nil {
		id := uuid.New()
		p.ID = &id
	}
	return nil
}

type RelationshipPrescriptionFields struct {
	MedicationTypes []MedicationType `json:"medicationType" gorm:"constraint:OnDelete:CASCADE;many2many:prescription_medication_types"`
	PrescribedBy    *uuid.UUID       `json:"prescribedBy"`
	Doctor          *Doctor          `gorm:"foreignKey:PrescribedBy"`
}

type Prescription struct {
	BasePrescriptionFields
	RelationshipPrescriptionFields
}
