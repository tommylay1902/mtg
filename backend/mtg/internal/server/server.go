package server

import (
	"mtg/internal/database"

	cDao "mtg/internal/server/dao/clinic"
	mtDao "mtg/internal/server/dao/medication_type"
	pDao "mtg/internal/server/dao/prescription"
	phDao "mtg/internal/server/dao/prescription_history"
	"mtg/internal/server/handler"
	cService "mtg/internal/server/service/clinic"
	mtService "mtg/internal/server/service/medication_type"
	pService "mtg/internal/server/service/prescription"
	phService "mtg/internal/server/service/prescriptionhistory"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type FiberServer struct {
	*fiber.App
	db      *gorm.DB
	Handler *handler.Handler
}

func New() *FiberServer {
	//setup keycloak client

	db := database.New()
	//init dao layer
	gormPrescriptionDao := pDao.InitializeGormDao(db)
	gormPrescriptionHistoryDao := phDao.InitializeGormPrescriptionHistoryDao(db)
	gormMedicationTypeDao := mtDao.InitializeGormDao(db)
	gormClinicDao := cDao.InitializeGormClinicDao(db)

	//init service layer
	fiberPrescriptionService := pService.InitializeFiberPrescriptionService(gormPrescriptionDao)
	fiberPrescriptionHistorySerivce := phService.InitializeFiberPrescriptionHistoryService(gormPrescriptionHistoryDao)
	fiberMedicationTypeService := mtService.InitializeFiberMedicationTypeService(gormMedicationTypeDao)
	fiberClinicService := cService.InitializeFiberClinicService(gormClinicDao)

	//init handlers
	handler := handler.InitHandlers(fiberPrescriptionService, fiberPrescriptionHistorySerivce, fiberMedicationTypeService, fiberClinicService)

	server := &FiberServer{
		App:     fiber.New(),
		db:      db,
		Handler: handler,
	}

	return server
}
