package phService_test

import (
	"log"
	dto "mtg/internal/models/dto/prescriptionhistory"
	"mtg/internal/models/entity"
	phService "mtg/internal/server/service/prescriptionhistory"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	m "github.com/stretchr/testify/mock"
)

type MockPrescriptionHistoryDAO struct {
	m.Mock
	Generated uuid.UUID
}

func (m *MockPrescriptionHistoryDAO) CreateHistory(model *entity.PrescriptionHistory) (*uuid.UUID, error) {
	args := m.Called(model)

	result := args.Get(0)
	err := args.Error(1)

	if result == nil {
		return nil, err
	}

	id, ok := result.(*uuid.UUID)

	if !ok {
		log.Panic("conversion went wrong in CreateHistory of service layer test")
	}

	return id, nil
}

func (m *MockPrescriptionHistoryDAO) GetAll(searchQueries map[string]string, email string) ([]entity.PrescriptionHistory, error) {
	args := m.Called(searchQueries, email)

	result, err := args.Get(0), args.Error(1)

	if err != nil {
		return nil, err
	}

	rxHistories, ok := result.([]entity.PrescriptionHistory)

	if !ok {
		log.Panic("conversion went wrong in GetAll Mock")
	}

	return rxHistories, nil
}

func (m *MockPrescriptionHistoryDAO) GetByEmailAndRx(email string, pId uuid.UUID) (*entity.PrescriptionHistory, error) {
	args := m.Called(email, pId)

	result, err := args.Get(0), args.Error(1)
	if err != nil {
		return nil, err
	}

	rxHistory, ok := result.(*entity.PrescriptionHistory)

	if !ok {
		log.Panic("conversion went wrong in GetByEmailAndRx mock function")
	}

	return rxHistory, args.Error(1)
}

func (m *MockPrescriptionHistoryDAO) DeleteByEmailAndRx(email string, pId uuid.UUID) error {
	args := m.Called(email, pId)
	return args.Error(0)
}

func (m *MockPrescriptionHistoryDAO) UpdateByModel(e *entity.PrescriptionHistory) error {
	args := m.Called(e)

	err := args.Error(0)

	return err
}

func MatchRxHistoryExceptUUID(rx *entity.PrescriptionHistory) interface{} {
	return m.MatchedBy(func(arg *entity.PrescriptionHistory) bool {
		return arg.Owner == rx.Owner &&
			arg.PrescriptionId == rx.PrescriptionId
	})
}

func TestCreatePrescriptionHistory(t *testing.T) {
	dao := &MockPrescriptionHistoryDAO{}

	service := phService.InitializeFiberPrescriptionHistoryService(dao)

	rxDTO := GenerateRxHistoryDTO()
	model, mapErr := dto.MapPrescriptionHistoryDTOToModel(rxDTO)

	if mapErr != nil {
		log.Panic("error mapping dto to model within TestCreatePrescriptionHistory")
	}

	dao.On("CreateHistory", MatchRxHistoryExceptUUID(model)).Return(model.Id, nil)

	id, err := service.CreatePrescriptionHistory(rxDTO)

	assert.NoError(t, err)

	assert.Equal(t, *id, *model.Id)
	dao.AssertExpectations(t)
}

func TestGetAll(t *testing.T) {
	email := "tommylay.c@gmail.com"

	rxOne := GenerateRxHistoryModel()

	rxTwo := GenerateRxHistoryModel()
	dao := &MockPrescriptionHistoryDAO{}

	service := phService.InitializeFiberPrescriptionHistoryService(dao)

	dao.On("GetAll", make(map[string]string), email).Return([]entity.PrescriptionHistory{*rxOne, *rxTwo}, nil)

	result, err := service.GetAll(make(map[string]string), email)

	assert.NoError(t, err)
	assert.Contains(t, result, *rxOne)
	assert.Contains(t, result, *rxTwo)
}

func TestGetByEmailAndRx(t *testing.T) {
	rx := GenerateRxHistoryModel()

	dao := &MockPrescriptionHistoryDAO{}

	service := phService.InitializeFiberPrescriptionHistoryService(dao)

	dao.On("GetByEmailAndRx", *rx.Owner, *rx.PrescriptionId).Return(rx, nil)

	result, err := service.GetByEmailAndRx(*rx.Owner, *rx.PrescriptionId)

	assert.NoError(t, err)

	assert.Equal(t, rx, result)

}

func TestDeleteByEmailAndId(t *testing.T) {
	email := "tommylay.c@gmail.com"
	id := uuid.New()

	dao := &MockPrescriptionHistoryDAO{}
	service := phService.InitializeFiberPrescriptionHistoryService(dao)

	dao.On("DeleteByEmailAndRx", email, id).Return(nil)

	err := service.DeleteByEmailAndRx(email, id)

	assert.NoError(t, err)
}

func TestUpdateUpdateByEmailAndRx(t *testing.T) {
	// Step 1: Generate initial Rx history model
	rxOne := GenerateRxHistoryModel()
	// originalOwner := rxOne.Owner
	newOwner := "new.owner@example.com" // Set a new owner to test the if condition
	newPrescription := uuid.New()
	taken := time.Now()
	rxDTO := &dto.PrescriptionHistoryDTO{
		PrescriptionId: &newPrescription,
		Owner:          &newOwner, // Use a different owner to trigger the if block
		Taken:          &taken,
	}

	// Step 2: Initialize mock DAO and service
	dao := &MockPrescriptionHistoryDAO{}
	service := phService.InitializeFiberPrescriptionHistoryService(dao)

	// Step 3: Set up mocks for GetByEmailAndRx and UpdateByModel
	dao.On("GetByEmailAndRx", "tommylay.c@gmail.com", newPrescription).Return(rxOne, nil)
	dao.On("UpdateByModel", mock.Anything).Return(nil).Run(func(args mock.Arguments) {
		// Simulate the update by modifying the rxOne object
		updatedRx := args.Get(0).(*entity.PrescriptionHistory)
		*rxOne = *updatedRx
	})

	// Step 4: Call the update method
	err := service.UpdateByEmailAndRx(rxDTO, "tommylay.c@gmail.com", *rxDTO.PrescriptionId)
	assert.NoError(t, err)

	// Step 5: Verify that UpdateByModel was called
	dao.AssertCalled(t, "UpdateByModel", mock.AnythingOfType("*entity.PrescriptionHistory"))

	// Step 6: Mock the result of GetByEmailAndRx after the update
	dao.On("GetByEmailAndRx", newOwner, *rxOne.PrescriptionId).Return(rxOne, nil)

	// Step 7: Retrieve the updated entity
	result, err := service.GetByEmailAndRx(newOwner, *rxOne.PrescriptionId)
	assert.NoError(t, err)

	// Step 8: Assert the updated values
	assert.Equal(t, *rxDTO.Taken, *result.Taken)
	assert.Equal(t, newOwner, *result.Owner)
	assert.Equal(t, newPrescription, *result.PrescriptionId)
}

func GenerateRxHistoryModel() *entity.PrescriptionHistory {
	email := "tommylay.c@gmail.com"
	taken := time.Now()
	id := uuid.New()
	pId := uuid.New()
	return &entity.PrescriptionHistory{
		Id:             &id,
		PrescriptionId: &pId,
		Owner:          &email,
		Taken:          &taken,
	}
}

func GenerateRxHistoryDTO() *dto.PrescriptionHistoryDTO {
	pId := uuid.New()
	owner := "tommylay.c@gmail.com"
	taken := time.Now()

	return &dto.PrescriptionHistoryDTO{
		PrescriptionId: &pId,
		Owner:          &owner,
		Taken:          &taken,
	}

}
