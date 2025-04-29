package phDao

import (
	"errors"
	"mtg/internal/error/apperror"
	"mtg/internal/helper"
	"mtg/internal/models/entity"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type GormPrescriptionHistoryDao struct {
	DB *gorm.DB
}

func InitializeGormPrescriptionHistoryDao(db *gorm.DB) *GormPrescriptionHistoryDao {
	return &GormPrescriptionHistoryDao{DB: db}
}

func (dao *GormPrescriptionHistoryDao) CreateHistory(entity *entity.PrescriptionHistory) (*uuid.UUID, error) {
	err := dao.DB.Create(entity).Error

	if err != nil {
		return nil, err
	}

	return entity.ID, nil
}

func (dao *GormPrescriptionHistoryDao) GetAll(searchQueries map[string]string, email string) ([]entity.PrescriptionHistory, error) {
	var history []entity.PrescriptionHistory
	query := helper.BuildQueryWithSearchParam(searchQueries, dao.DB)

	err := query.Where("owner = ?", email).Order("taken desc").Find(&history).Error

	if err != nil {
		return nil, err
	}

	return history, nil

}

func (dao *GormPrescriptionHistoryDao) GetByEmailAndRx(email string, pId uuid.UUID) (*entity.PrescriptionHistory, error) {
	var rxHistory entity.PrescriptionHistory

	err := dao.DB.Where("owner = ?", email).Where("prescription_id = ?", pId).First(&rxHistory).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, &apperror.ResourceNotFound{
				Message: "prescription history not found",
				Code:    404,
			}
		}
		return nil, err
	}

	return &rxHistory, err
}

func (dao *GormPrescriptionHistoryDao) DeleteByEmailAndRx(email string, pId uuid.UUID) error {
	db := dao.DB.Where("owner = ? AND prescription_id = ?", email, pId).Delete(&entity.PrescriptionHistory{})

	if db.Error != nil {
		return db.Error
	}
	if db.RowsAffected <= 0 {
		return &apperror.ResourceNotFound{Message: "Prescription History not found", Code: 404}
	}
	return nil
}

func (dao *GormPrescriptionHistoryDao) UpdateByModel(updatedRx *entity.PrescriptionHistory) error {
	err := dao.DB.Save(updatedRx).Error

	if err != nil {
		return err
	}

	return nil
}
