package entity

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type HealthCareFacility struct {
	ID             *uuid.UUID `json:"id" gorm:"type:uuid;primaryKey"`
	Name           string     `json:"name" gorm:"uniqueIndex"`
	LocationID     *uuid.UUID `json:"location"`
	ClinicLocation *Location  `gorm:"foreignKey:LocationID;references:ID"`
	Owner          *string    `json:"owner"`
	Type           *string    `json:"type"`
}

func (hc *HealthCareFacility) BeforeCreate(tx *gorm.DB) error {
	if hc.ID == nil {
		id := uuid.New()
		hc.ID = &id
	}
	return nil
}
