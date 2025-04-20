package entity

import "github.com/google/uuid"

type BaseMedicationFields struct {
	Type          string         `json:"type"`
	Prescriptions []Prescription `gorm:"many2many:prescription_medication_types"`
}
type MedicationType struct {
	ID uuid.UUID `json:"id" gorm:"type:uuid;primaryKey"`
	BaseMedicationFields
}
