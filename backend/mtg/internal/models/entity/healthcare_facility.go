package entity

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type HealthCareFacility struct {
	ID             *uuid.UUID `json:"id" gorm:"type:uuid;primaryKey"`
	Name           string     `json:"name" gorm:"index:idx_healthcare_facility_name_location,unique"`
	LocationID     *uuid.UUID `json:"location" gorm:"index:idx_healthcare_facility_name_location,unique"`
	ClinicLocation *Location  `gorm:"foreignKey:LocationID;references:ID;"`
	Owner          *string    `json:"owner" gorm:"index:idx_healthcare_facility_name_location,unique"`
	Type           *string    `json:"type"`
}

func (hc *HealthCareFacility) BeforeCreate(tx *gorm.DB) error {
	if hc.ID == nil {
		id := uuid.New()
		hc.ID = &id
	}
	return nil
}
