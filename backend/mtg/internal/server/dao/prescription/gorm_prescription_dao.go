package pDao

import (
	"errors"
	"fmt"
	"mtg/internal/error/apperror"
	"mtg/internal/helper"
	"mtg/internal/models/entity"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type GormPrescriptionDao struct {
	DB *gorm.DB
}

func InitializeGormDao(db *gorm.DB) *GormPrescriptionDao {
	return &GormPrescriptionDao{DB: db}
}

func (dao *GormPrescriptionDao) CreatePrescription(model entity.Prescription) (*uuid.UUID, error) {

	tx := dao.DB.Begin()

	if err := tx.Create(&model).Error; err != nil {
		tx.Rollback()
		return nil, err
	}
	fmt.Println(model.ID)
	fmt.Println(model)

	if err := tx.Model(&model).Association("MedicationTypes").Append(model.MedicationTypes); err != nil {
		tx.Rollback()
		return nil, err
	}

	err := tx.Commit().Error

	if err != nil {
		return nil, err
	}

	return model.ID, nil
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

func (dao *GormPrescriptionDao) DeleteBatchPrescription(deleteList []uuid.UUID, email string) error {
	err := dao.DB.Table("prescriptions").Where("owner = ? AND id IN ?", email, deleteList).Delete(&entity.Prescription{}).Error

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

func (dao *GormPrescriptionDao) UpdateBatchPrescription(updateList []entity.Prescription, email string) error {
	// err := dao.DB.Where("owner = ? and id IN ?", email, updateList).Save(updateList).Error
	// if err != nil {
	// 	return err
	// }

	// create values array which represents the rows
	values := make([]clause.Expr, 0, len(updateList))
	for _, p := range updateList {
		values = append(values, gorm.Expr("(?::uuid, ?, ?, ?, ?::timestamp, ?::timestamp, ?::bigint, ?)", p.ID, p.Medication, p.Dosage, p.Notes, p.Started, p.Ended, p.Refills, p.Owner))
	}

	valuesExpr := gorm.Expr("?", values)
	valuesExpr.WithoutParentheses = true

	err := dao.DB.Exec(
		"UPDATE prescriptions SET Medication = tmp.Medication, dosage = tmp.Dosage,  notes = tmp.Notes, started = tmp.Started, ended = tmp.Ended, refills = tmp.Refills FROM (VALUES ?) tmp(ID, Medication, Dosage, Notes, Started, Ended, Refills, Owner) WHERE prescriptions.ID = tmp.ID AND prescriptions.owner = ?",
		valuesExpr,
		email,
	).Error

	if err != nil {
		return err
	}

	return nil
}
