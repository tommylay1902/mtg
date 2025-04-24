package handler

import (
	cService "mtg/internal/server/service/clinic"
	dService "mtg/internal/server/service/doctor"
	mtService "mtg/internal/server/service/medication_type"
	pService "mtg/internal/server/service/prescription"
	phService "mtg/internal/server/service/prescriptionhistory"
)

type Handler struct {
	PHandler              *PrescriptionHandler
	HistoryHandler        *PrescriptionHistoryHandler
	MedicationTypeHandler *MedicationTypeHandler
	ClinicHandler         *ClinicHandler
	DoctorHandler         *DoctorHandler
}

func InitHandlers(pService *pService.FiberPrescriptionService, hService *phService.FiberPrescriptionHistoryService, mtService *mtService.FiberMedicationTypeService, cService *cService.FiberClinicService, dService *dService.FiberDoctorService) *Handler {
	pHandler := InitializePrescriptionHandler(pService)
	historyHandler := InitializePrescriptionHistoryHandler(hService)
	mtHandler := InitializeMedicationTypeHandler(mtService)
	cHandler := InitializeClinicHandler(cService)
	dHandler := InitiliazeDoctorHandler(dService)
	return &Handler{PHandler: pHandler, HistoryHandler: historyHandler, MedicationTypeHandler: mtHandler, ClinicHandler: cHandler, DoctorHandler: dHandler}
}
