package server

func (s *FiberServer) RegisterFiberRoutes() {

	apiPrescriptionRoutes := s.Group("api/v1/prescription")
	apiPrescriptionRoutes.Post("", s.Handler.PHandler.CreatePrescription)
	apiPrescriptionRoutes.Get("/all/:email", s.Handler.PHandler.GetPrescriptions)
	apiPrescriptionRoutes.Get("/:email/:id", s.Handler.PHandler.GetPrescription)
	apiPrescriptionRoutes.Delete("/:email/:id", s.Handler.PHandler.DeletePrescription)
	apiPrescriptionRoutes.Put("/:email/:id", s.Handler.PHandler.UpdatePrescription)

	apiPrescriptionHistoryRoutes := s.Group("api/v1/prescriptionhistory")
	apiPrescriptionHistoryRoutes.Post("", s.Handler.HistoryHandler.CreatePrescriptionHistory)
	apiPrescriptionHistoryRoutes.Get("/all/:email", s.Handler.HistoryHandler.GetAll)
	apiPrescriptionHistoryRoutes.Get("/:email/:pId", s.Handler.HistoryHandler.GetByEmailAndRx)
	apiPrescriptionHistoryRoutes.Delete("/:email/:pId", s.Handler.HistoryHandler.DeleteByEmailAndRx)
	apiPrescriptionHistoryRoutes.Put("/:email/:pId", s.Handler.HistoryHandler.UpdateByEmailAndRx)
}
