package entity

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Clinic struct {
	ID             *uuid.UUID      `json:"id" gorm:"type:uuid;primaryKey"`
	Name           string          `json:"name" gorm:"uniqueIndex"`
	LocationID     *uuid.UUID      `json:"location"`
	ClinicLocation *ClinicLocation `gorm:"foreignKey:LocationID;references:ID"`
	Owner          *string         `json:"owner"`
}

func (c *Clinic) BeforeCreate(tx *gorm.DB) error {
	if c.ID == nil {
		id := uuid.New()
		c.ID = &id
	}
	return nil
}
