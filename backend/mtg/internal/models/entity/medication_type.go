package entity

import "github.com/google/uuid"

type MedicationType struct {
	ID   uuid.UUID `json:"id" gorm:"type:uuid;primaryKey"`
	Type string    `json:"type"`
}
