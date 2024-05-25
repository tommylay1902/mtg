package server

func (s *FiberServer) RegisterFiberRoutes() {

	apiRoutes := s.Group("api/v1/prescription")
	apiRoutes.Post("", s.Handler.PHandler.CreatePrescription)
	apiRoutes.Get("/all/:email", s.Handler.PHandler.GetPrescriptions)
	apiRoutes.Get("/:email/:id", s.Handler.PHandler.GetPrescription)
	apiRoutes.Delete("/:email/:id", s.Handler.PHandler.DeletePrescription)
	apiRoutes.Put("/:email/:id", s.Handler.PHandler.UpdatePrescription)

}
