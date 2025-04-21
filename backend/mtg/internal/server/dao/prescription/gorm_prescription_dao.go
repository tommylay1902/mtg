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

func (dao *GormPrescriptionDao) GetMedicationTypesByPrescriptionId(prescription *entity.Prescription) ([]entity.MedicationType, error) {
	var medTypes []entity.MedicationType
	err := dao.DB.Model(&prescription).Association("MedicationTypes").Find(&medTypes)
	if err != nil {
		return nil, err
	}
	fmt.Println("helloo")
	return medTypes, nil
}

func (dao *GormPrescriptionDao) GetAllPrescriptions(searchQueries map[string]string, owner *string) ([]entity.Prescription, error) {
	var prescriptions []entity.Prescription

	query := helper.BuildQueryWithSearchParam(searchQueries, dao.DB)

	err := query.Where("owner = ?", *owner).Order("started desc").Preload("MedicationTypes",
		func(db *gorm.DB) *gorm.DB {
			return db.Select("id", "type")
		}).Find(&prescriptions).Error
	fmt.Println(prescriptions[0].MedicationTypes)
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
	return dao.DB.Transaction(func(tx *gorm.DB) error {
		// 1. Batch update prescription fields
		if err := dao.batchUpdatePrescriptions(tx, updateList, email); err != nil {
			return err
		}

		// 2. Batch update associations using Replace()
		return dao.batchUpdateAssociations(tx, updateList)
	})
	// create values array which represents the rows
	// values := make([]clause.Expr, 0, len(updateList))
	// for _, p := range updateList {
	// 	values = append(values, gorm.Expr("(?::uuid, ?, ?, ?, ?::timestamp, ?::timestamp, ?::bigint, ?)", p.ID, p.Medication, p.Dosage, p.Notes, p.Started, p.Ended, p.Refills, p.Owner))
	// }

	// valuesExpr := gorm.Expr("?", values)
	// valuesExpr.WithoutParentheses = true

	// err := dao.DB.Exec(
	// 	"UPDATE prescriptions SET Medication = tmp.Medication, dosage = tmp.Dosage,  notes = tmp.Notes, started = tmp.Started, ended = tmp.Ended, refills = tmp.Refills FROM (VALUES ?) tmp(ID, Medication, Dosage, Notes, Started, Ended, Refills, Owner) WHERE prescriptions.ID = tmp.ID AND prescriptions.owner = ?",
	// 	valuesExpr,
	// 	email,
	// ).Error

	// if err != nil {
	// 	return err
	// }

	// return nil
}

func (dao *GormPrescriptionDao) batchUpdatePrescriptions(tx *gorm.DB, updateList []entity.Prescription, email string) error {
	// Your existing optimized bulk update
	values := make([]clause.Expr, 0, len(updateList))
	for _, p := range updateList {
		values = append(values, gorm.Expr("(?::uuid, ?, ?, ?, ?::timestamp, ?::timestamp, ?::bigint, ?)",
			p.ID, p.Medication, p.Dosage, p.Notes, p.Started, p.Ended, p.Refills, p.Owner))
	}

	valuesExpr := gorm.Expr("?", values)
	valuesExpr.WithoutParentheses = true

	return tx.Exec(
		`UPDATE prescriptions SET
            medication = tmp.medication,
            dosage = tmp.dosage,
            notes = tmp.notes,
            started = tmp.started,
            ended = tmp.ended,
            refills = tmp.refills
        FROM (VALUES ?) tmp(id, medication, dosage, notes, started, ended, refills, owner)
        WHERE prescriptions.id = tmp.id AND prescriptions.owner = ?`,
		valuesExpr,
		email,
	).Error
}

func (dao *GormPrescriptionDao) batchUpdateAssociations(tx *gorm.DB, updateList []entity.Prescription) error {
	for _, p := range updateList {
		// Load the full prescription model with associations
		var current entity.Prescription
		if err := tx.Where("id = ?", p.ID).First(&current).Error; err != nil {
			return err
		}

		// Use Replace to atomically update associations
		if err := tx.Model(&current).Association("MedicationTypes").Replace(p.MedicationTypes); err != nil {
			return err
		}
	}
	return nil
}
