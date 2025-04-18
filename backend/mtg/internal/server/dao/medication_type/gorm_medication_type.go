package mtDao

import (
	"fmt"
	"mtg/internal/models/entity"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type GormMedicationTypeDao struct {
	DB *gorm.DB
}

func InitializeGormDao(db *gorm.DB) *GormMedicationTypeDao {
	return &GormMedicationTypeDao{DB: db}
}

func (dao *GormMedicationTypeDao) CreateMedicationType(model *entity.MedicationType) (*uuid.UUID, error) {
	err := dao.DB.Create(&model).Error
	fmt.Println(model)
	if err != nil {
		return nil, err
	}

	return &model.ID, err
}
