package entity

import (
	"time"

	"github.com/google/uuid"
)

type Prescription struct {
	ID              uuid.UUID        `json:"id" gorm:"type:uuid;primaryKey"`
	Medication      string           `json:"medication"`
	MedicationTypes []MedicationType `json:"medicationType" gorm:"many2many:prescription_medication_types"`
	Dosage          string           `json:"dosage"`
	Notes           *string          `json:"notes"`
	Started         *time.Time       `json:"started" gorm:"type:timestamp;"`
	Ended           *time.Time       `json:"ended" gorm:"type:timestamp;"`
	Refills         *int             `json:"refills"`
	Total           *int             `json:"total" gorm:"type:SMALLINT;default:0"`
	Owner           *string          `json:"owner"`
	PrescribedBy    *uuid.UUID       `json:"prescribedBy"`
	Doctor          *Doctor          `gorm:"foreignKey:PrescribedBy"`
}
