package server

import (
	"mtg/internal/database"
	"mtg/internal/server/dao"
	"mtg/internal/server/handler"
	"mtg/internal/server/service"

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
	gormPrescriptionDao := dao.InitializeGormDao(db)
	fiberPrescriptionService := service.Initialize(gormPrescriptionDao)
	handler := handler.InitHandlers(fiberPrescriptionService)

	server := &FiberServer{
		App:     fiber.New(),
		db:      db,
		Handler: handler,
	}

	return server
}
