package entity

import "github.com/google/uuid"

type MedicationType struct {
	ID   uuid.UUID `json:"id" gorm:"type:uuid;default:uuid_generate_v4();primaryKey"`
	Type string    `json:"type"`
}
