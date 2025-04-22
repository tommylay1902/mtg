package cDao

import (
	"mtg/internal/models/entity"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type GormClinicDao struct {
	DB *gorm.DB
}

func InitializeGormClinicDao(db *gorm.DB) *GormClinicDao {
	return &GormClinicDao{DB: db}
}

func (dao *GormClinicDao) CreateClinic(model entity.Clinic) (*uuid.UUID, error) {
	err := dao.DB.Create(&model).Error

	if err != nil {
		return nil, err
	}

	return model.ID, err
}
