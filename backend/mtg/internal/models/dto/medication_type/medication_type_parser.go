package dto

import (
	"mtg/internal/models/entity"

	"github.com/google/uuid"
)

func MapMedicationTypeDTOToEntity(dto *MedicationType) (*entity.MedicationType, error) {
	var id, err = uuid.NewRandom()
	if err != nil {
		return nil, err
	}
	model := &entity.MedicationType{
		ID:   id,
		Type: dto.Type,
	}
	return model, nil
}
