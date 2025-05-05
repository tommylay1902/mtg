package entity

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Location struct {
	ID          *uuid.UUID `json:"id" gorm:"type:uuid;primaryKey"`
	Street      *string    `json:"street"`
	City        *string    `json:"city"`
	State       *string    `json:"state"`
	Notes       *string    `json:"notes"`
	PhoneNumber *string    `json:"phone_number"`
	PostalCode  *string    `json:"postal_code"`
	Country     *string    `json:"country"`
}

func (loc *Location) BeforeCreate(tx *gorm.DB) error {
	if loc.ID == nil {
		id := uuid.New()
		loc.ID = &id
	}
	return nil
}
