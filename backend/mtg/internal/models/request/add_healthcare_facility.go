package request

import "mtg/internal/models/entity"

// implement later
// "github.com/go-playground/validator/v10"
//

// CreateHealthCareFacilityRequest represents the payload for creating a new healthcare facility
type CreateHealthCareFacilityRequest struct {
	// Name of the healthcare facility (required)
	Name string `json:"name"`

	Type *string `json:"type,omitempty"`

	// Location details (required)
	Location entity.Location `json:"location"`
}

// // Validate performs validation on the request struct
// func (r *CreateHealthCareFacilityRequest) Validate() error {
// 	validate := validator.New()
// 	return validate.Struct(r)
// }

// ToEntity converts the DTO to entity models
func (r *CreateHealthCareFacilityRequest) ToEntity() (entity.HealthCareFacility, entity.Location) {
	location := entity.Location{
		Street:      r.Location.Street,
		City:        r.Location.City,
		State:       r.Location.State,
		PostalCode:  r.Location.PostalCode,
		Country:     r.Location.Country,
		PhoneNumber: r.Location.PhoneNumber,
	}

	if r.Location.ID != nil {
		location.ID = r.Location.ID
	}

	facility := entity.HealthCareFacility{
		Name: r.Name,
		Type: r.Type,
	}

	return facility, location
}
