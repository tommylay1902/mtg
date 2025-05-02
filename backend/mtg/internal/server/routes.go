package server

import "mtg/internal/server/middleware"

func (s *FiberServer) RegisterFiberRoutes() {
	apiPrescriptionRoutes := s.Group("api/v1/prescription")
	apiPrescriptionRoutes.Use(middleware.SupabaseProtected())
	apiPrescriptionRoutes.Post("", s.Handler.PHandler.CreatePrescription)
	apiPrescriptionRoutes.Get("/all", s.Handler.PHandler.GetPrescriptions)
	apiPrescriptionRoutes.Get("/:id", s.Handler.PHandler.GetPrescription)
	apiPrescriptionRoutes.Get("/:id/medication-types", s.Handler.PHandler.GetMedicationTypeByPrescription)
	apiPrescriptionRoutes.Delete("", s.Handler.PHandler.DeleteBatchPrescription)
	apiPrescriptionRoutes.Put("", s.Handler.PHandler.UpdateBatchPrescription)

	apiPrescriptionHistoryRoutes := s.Group("api/v1/prescriptionhistory")
	apiPrescriptionHistoryRoutes.Post("", s.Handler.HistoryHandler.CreatePrescriptionHistory)
	apiPrescriptionHistoryRoutes.Get("/all/:email", s.Handler.HistoryHandler.GetAll)
	apiPrescriptionHistoryRoutes.Get("/:email/:pId", s.Handler.HistoryHandler.GetByEmailAndRx)
	apiPrescriptionHistoryRoutes.Delete("/:email/:pId", s.Handler.HistoryHandler.DeleteByEmailAndRx)
	apiPrescriptionHistoryRoutes.Put("/:email/:pId", s.Handler.HistoryHandler.UpdateByEmailAndRx)

	apiMedicationTypeRoutes := s.Group("api/v1/medication-type")
	apiMedicationTypeRoutes.Use(middleware.SupabaseProtected())
	apiMedicationTypeRoutes.Post("", s.Handler.MedicationTypeHandler.CreateMedicationType)
	apiMedicationTypeRoutes.Get("/all", s.Handler.MedicationTypeHandler.GetMedicationTypes)

	apiHealthCareFacilityRoutes := s.Group("api/v1/healthcare-facility")
	apiHealthCareFacilityRoutes.Use(middleware.SupabaseProtected())
	apiHealthCareFacilityRoutes.Post("", s.Handler.HealthCareFacilityHandler.CreateHealthCareFacility)
	apiHealthCareFacilityRoutes.Get("/all", s.Handler.HealthCareFacilityHandler.GetAllHealthCareFacility)
	apiHealthCareFacilityRoutes.Get("/pharmacy/all", s.Handler.HealthCareFacilityHandler.GetAllPharmacy)

	apiDoctorRoutes := s.Group("api/v1/doctor")
	apiDoctorRoutes.Use(middleware.SupabaseProtected())
	apiDoctorRoutes.Post("", s.Handler.DoctorHandler.CreateDoctor)
	apiDoctorRoutes.Get("/all", s.Handler.DoctorHandler.GetDoctors)

}
