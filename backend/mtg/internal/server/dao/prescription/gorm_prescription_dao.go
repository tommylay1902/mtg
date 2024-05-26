package pDao

import (
	"errors"
	"mtg/internal/error/apperror"
	"mtg/internal/helper"
	"mtg/internal/models/entity"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type GormPrescriptionDao struct {
	DB *gorm.DB
}

func InitializeGormDao(db *gorm.DB) *GormPrescriptionDao {
	return &GormPrescriptionDao{DB: db}
}

func (dao *GormPrescriptionDao) CreatePrescription(model *entity.Prescription) (*uuid.UUID, error) {
	err := dao.DB.Create(&model).Error
	if err != nil {
		return nil, err
	}

	return &model.ID, nil
}

func (dao *GormPrescriptionDao) GetPrescriptionById(id uuid.UUID, email string) (*entity.Prescription, error) {
	prescription := new(entity.Prescription)
	err := dao.DB.Where("owner = ?", email).First(&prescription, id).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, &apperror.ResourceNotFound{
				Message: "prescription not found",
				Code:    404,
			}
		}
		return nil, err
	}

	return prescription, nil
}

func (dao *GormPrescriptionDao) GetAllPrescriptions(searchQueries map[string]string, owner *string) ([]entity.Prescription, error) {
	var prescriptions []entity.Prescription

	query := helper.BuildQueryWithSearchParam(searchQueries, dao.DB)

	err := query.Where("owner = ?", *owner).Order("started desc").Find(&prescriptions).Error

	if err != nil {
		return nil, err
	}

	return prescriptions, nil
}

func (dao *GormPrescriptionDao) DeletePrescription(model *entity.Prescription, email string) error {
	err := dao.DB.Where("owner = ?", email).Delete(&model).Error
	if err != nil {
		return err
	}
	return nil
}

func (dao *GormPrescriptionDao) UpdatePrescription(model *entity.Prescription, email string) error {
	err := dao.DB.Where("owner = ?", email).Save(&model).Error

	if err != nil {
		return err
	}

	return nil

}
