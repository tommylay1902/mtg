package dto

import (
	"mtg/internal/models/entity"
)

// func MapPrescriptionDTOToEntity(dto *PrescriptionDTO) (*entity.Prescription, error) {
// 	var id, err = uuid.NewRandom()
// 	if err != nil {
// 		return nil, err
// 	}
// 	model := &entity.Prescription{
// 		ID:         id,
// 		Medication: dto.Medication,
// 		Dosage:     dto.Dosage,
// 		Notes:      dto.Notes,
// 		Started:    dto.Started,
// 		Ended:      dto.Ended,
// 		Refills:    dto.Refills,
// 		Owner:      dto.Owner,
// 	}
// 	return model, nil
// }

func MapPrescriptionEntityToDTO(p *entity.Prescription) (*PrescriptionDTO, error) {
	dto := &PrescriptionDTO{
		Medication: p.Medication,
		Dosage:     p.Dosage,
		Notes:      p.Notes,
		Started:    p.Started,
		Ended:      p.Ended,
		Refills:    p.Refills,
		Owner:      p.Owner,
	}
	return dto, nil
}

func MapPrescriptionEntitySliceToDTOSlice(prescriptions []entity.Prescription) ([]PrescriptionDTO, error) {
	var resultMapping []PrescriptionDTO
	for _, p := range prescriptions {
		dto, err := MapPrescriptionEntityToDTO(&p)
		if err != nil {
			return nil, err
		}
		resultMapping = append(resultMapping, *dto)
	}
	return resultMapping, nil
}

// func MapPrescriptionDTOSliceToEntitySlice(prescriptions []PrescriptionDTO) ([]entity.Prescription, error) {
// 	var resultMapping []entity.Prescription
// 	for _, dto := range prescriptions {
// 		p, err := MapPrescriptionDTOToEntity(&dto)
// 		if err != nil {
// 			return nil, err
// 		}
// 		resultMapping = append(resultMapping, *p)
// 	}
// 	return resultMapping, nil
// }
