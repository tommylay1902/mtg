package dDao

import (
	"mtg/internal/models/entity"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type GormDoctorDao struct {
	DB *gorm.DB
}

func InitializeGormDoctorDao(db *gorm.DB) *GormDoctorDao {
	return &GormDoctorDao{DB: db}
}

func (dao *GormDoctorDao) CreateDoctor(model *entity.Doctor) (*uuid.UUID, error) {
	err := dao.DB.Create(&model).Error
	if err != nil {
		return nil, err
	}
	return model.ID, nil
}

func (dao *GormDoctorDao) GetDoctors(email *string) ([]entity.Doctor, error) {
	var doctors []entity.Doctor

	err := dao.DB.Where("owner = ?", *email).Find(&doctors).Error
	if err != nil {
		return nil, err
	}

	return doctors, nil
}
