package entity

import "github.com/google/uuid"

type Clinic struct {
	ID          uuid.UUID `json:"id" gorm:"type:uuid;primaryKey"`
	Name        string    `json:"name"`
	Street      *string   `json:"street"`
	City        *string   `json:"city"`
	State       *string   `json:"state"`
	Notes       *string   `json:"notes"`
	PhoneNumber *string   `json:"phone_number"`
}
