package server

import (
	"mtg/internal/database"

	dDao "mtg/internal/server/dao/doctor"
	hcDao "mtg/internal/server/dao/healthcare_facility"
	mtDao "mtg/internal/server/dao/medication_type"
	pDao "mtg/internal/server/dao/prescription"
	phDao "mtg/internal/server/dao/prescription_history"
	"mtg/internal/server/handler"
	dService "mtg/internal/server/service/doctor"
	hcService "mtg/internal/server/service/healthcare_faciliity"
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
	gormHealthCareFacilityDao := hcDao.InitializeGormHealthCareFacilityDao(db)
	gormDoctorDao := dDao.InitializeGormDoctorDao(db)

	//init service layer
	fiberPrescriptionService := pService.InitializeFiberPrescriptionService(gormPrescriptionDao)
	fiberPrescriptionHistorySerivce := phService.InitializeFiberPrescriptionHistoryService(gormPrescriptionHistoryDao)
	fiberMedicationTypeService := mtService.InitializeFiberMedicationTypeService(gormMedicationTypeDao)
	fiberHealthCareFacilityService := hcService.InitializeFiberHealthCareFacilityervice(gormHealthCareFacilityDao)
	fiberDoctorService := dService.InitializeFiberDoctorService(gormDoctorDao)

	//init handlers
	handler := handler.InitHandlers(fiberPrescriptionService, fiberPrescriptionHistorySerivce, fiberMedicationTypeService, fiberHealthCareFacilityService, fiberDoctorService)

	server := &FiberServer{
		App:     fiber.New(),
		db:      db,
		Handler: handler,
	}

	return server
}
