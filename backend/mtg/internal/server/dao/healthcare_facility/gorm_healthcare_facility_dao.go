package hcDao

import (
	"mtg/internal/models/entity"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type GormHealthCareFacilityDao struct {
	DB *gorm.DB
}

func InitializeGormHealthCareFacilityDao(db *gorm.DB) *GormHealthCareFacilityDao {
	return &GormHealthCareFacilityDao{DB: db}
}

func (dao *GormHealthCareFacilityDao) CreateHealthCareFacility(model entity.HealthCareFacility) (*uuid.UUID, error) {

	err := dao.DB.Create(&model).Error

	if err != nil {
		return nil, err
	}

	return model.ID, err
}

func (dao *GormHealthCareFacilityDao) GetAll(owner *string) ([]entity.HealthCareFacility, error) {
	var healthCareFacilities []entity.HealthCareFacility

	err := dao.DB.Where("owner = ?", *owner).Find(&healthCareFacilities).Error

	if err != nil {
		return nil, err
	}

	return healthCareFacilities, nil

}

func (dao *GormHealthCareFacilityDao) GetAllPharmacy(owner *string) ([]entity.HealthCareFacility, error) {
	var healthCareFacilities []entity.HealthCareFacility

	err := dao.DB.Where("owner = ? AND type = 'Pharmacy'", *owner).Find(&healthCareFacilities).Error

	if err != nil {
		return nil, err
	}

	return healthCareFacilities, nil
}
