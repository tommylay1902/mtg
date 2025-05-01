package handler

import (
	dService "mtg/internal/server/service/doctor"
	hcService "mtg/internal/server/service/healthcare_faciliity"
	mtService "mtg/internal/server/service/medication_type"
	pService "mtg/internal/server/service/prescription"
	phService "mtg/internal/server/service/prescriptionhistory"
)

type Handler struct {
	PHandler                  *PrescriptionHandler
	HistoryHandler            *PrescriptionHistoryHandler
	MedicationTypeHandler     *MedicationTypeHandler
	HealthCareFacilityHandler *HealthCareFacilityHandler
	DoctorHandler             *DoctorHandler
}

func InitHandlers(pService *pService.FiberPrescriptionService, hService *phService.FiberPrescriptionHistoryService, mtService *mtService.FiberMedicationTypeService, hcService *hcService.FiberHealthCareFacilityService, dService *dService.FiberDoctorService) *Handler {
	pHandler := InitializePrescriptionHandler(pService)
	historyHandler := InitializePrescriptionHistoryHandler(hService)
	mtHandler := InitializeMedicationTypeHandler(mtService)
	hcHandler := InitializeClinicHandler(hcService)
	dHandler := InitiliazeDoctorHandler(dService)
	return &Handler{PHandler: pHandler, HistoryHandler: historyHandler, MedicationTypeHandler: mtHandler, HealthCareFacilityHandler: hcHandler, DoctorHandler: dHandler}
}
