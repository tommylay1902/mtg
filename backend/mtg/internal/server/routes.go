package server

import "mtg/internal/server/middleware"

func (s *FiberServer) RegisterFiberRoutes() {
	apiPrescriptionRoutes := s.Group("api/v1/prescription")
	apiPrescriptionRoutes.Use(middleware.SupabaseProtected())
	apiPrescriptionRoutes.Post("", s.Handler.PHandler.CreatePrescription)
	apiPrescriptionRoutes.Get("/all", s.Handler.PHandler.GetPrescriptions)
	apiPrescriptionRoutes.Get("/:id", s.Handler.PHandler.GetPrescription)
	apiPrescriptionRoutes.Delete("", s.Handler.PHandler.DeleteBatchPrescription)
	apiPrescriptionRoutes.Put("", s.Handler.PHandler.UpdateBatchPrescription)

	apiPrescriptionHistoryRoutes := s.Group("api/v1/prescriptionhistory")
	apiPrescriptionHistoryRoutes.Post("", s.Handler.HistoryHandler.CreatePrescriptionHistory)
	apiPrescriptionHistoryRoutes.Get("/all/:email", s.Handler.HistoryHandler.GetAll)
	apiPrescriptionHistoryRoutes.Get("/:email/:pId", s.Handler.HistoryHandler.GetByEmailAndRx)
	apiPrescriptionHistoryRoutes.Delete("/:email/:pId", s.Handler.HistoryHandler.DeleteByEmailAndRx)
	apiPrescriptionHistoryRoutes.Put("/:email/:pId", s.Handler.HistoryHandler.UpdateByEmailAndRx)

	apiMedicationTypeRoutes := s.Group("api/v1/medication-type")
	apiMedicationTypeRoutes.Post("", s.Handler.MedicationTypeHandler.CreateMedicationType)
}
