package server

import (
	"mtg/internal/database"

	pDao "mtg/internal/server/dao/prescription"
	phDao "mtg/internal/server/dao/prescription_history"
	"mtg/internal/server/handler"
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
	db := database.New()
	gormPrescriptionDao := pDao.InitializeGormDao(db)
	gormPrescriptionHistoryDao := phDao.InitializeGormPrescriptionHistoryDao(db)
	fiberPrescriptionService := pService.InitializeFiberPrescriptionService(gormPrescriptionDao)
	fiberPrescriptionHistorySerivce := phService.InitializeFiberPrescriptionHistoryService(gormPrescriptionHistoryDao)
	// fiberPrescriptionHistoryService := service
	handler := handler.InitHandlers(fiberPrescriptionService, fiberPrescriptionHistorySerivce)

	server := &FiberServer{
		App:     fiber.New(),
		db:      db,
		Handler: handler,
	}

	return server
}
