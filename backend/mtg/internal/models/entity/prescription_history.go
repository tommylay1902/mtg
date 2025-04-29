package entity

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PrescriptionHistory struct {
	ID             *uuid.UUID `json:"id" gorm:"primaryKey"`
	PrescriptionId *uuid.UUID `json:"prescription" gorm:"uniqueIndex:prescription_to_owner;not null"`
	Owner          *string    `json:"owner" gorm:"uniqueIndex:prescription_to_owner;not null"`
	Taken          *time.Time `json:"taken"`
}

func (ph *PrescriptionHistory) BeforeCreate(tx *gorm.DB) error {
	if ph.ID == nil {
		id := uuid.New()
		ph.ID = &id
	}
	return nil
}
