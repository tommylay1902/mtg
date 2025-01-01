package server

import "github.com/gofiber/fiber/v2"

func (s *FiberServer) RegisterFiberRoutes(kcMiddleware func(*fiber.Ctx) error, jwtMiddleware func(*fiber.Ctx) error) {

	apiPrescriptionRoutes := s.Group("api/v1/prescription", kcMiddleware, jwtMiddleware)
	apiPrescriptionRoutes.Post("", s.Handler.PHandler.CreatePrescription)
	apiPrescriptionRoutes.Get("/all", s.Handler.PHandler.GetPrescriptions, kcMiddleware, jwtMiddleware)
	apiPrescriptionRoutes.Get("/:id", s.Handler.PHandler.GetPrescription)
	// apiPrescriptionRoutes.Delete("/:id", s.Handler.PHandler.DeletePrescription)
	apiPrescriptionRoutes.Delete("", s.Handler.PHandler.DeleteBatchPrescription)
	apiPrescriptionRoutes.Put("/:id", s.Handler.PHandler.UpdatePrescription)

	apiPrescriptionHistoryRoutes := s.Group("api/v1/prescriptionhistory")
	apiPrescriptionHistoryRoutes.Post("", s.Handler.HistoryHandler.CreatePrescriptionHistory)
	apiPrescriptionHistoryRoutes.Get("/all/:email", s.Handler.HistoryHandler.GetAll)
	apiPrescriptionHistoryRoutes.Get("/:email/:pId", s.Handler.HistoryHandler.GetByEmailAndRx)
	apiPrescriptionHistoryRoutes.Delete("/:email/:pId", s.Handler.HistoryHandler.DeleteByEmailAndRx)
	apiPrescriptionHistoryRoutes.Put("/:email/:pId", s.Handler.HistoryHandler.UpdateByEmailAndRx)
}
