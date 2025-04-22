package handler

import (
	cService "mtg/internal/server/service/clinic"
	mtService "mtg/internal/server/service/medication_type"
	pService "mtg/internal/server/service/prescription"
	phService "mtg/internal/server/service/prescriptionhistory"
)

type Handler struct {
	PHandler              *PrescriptionHandler
	HistoryHandler        *PrescriptionHistoryHandler
	MedicationTypeHandler *MedicationTypeHandler
	ClinicHandler         *ClinicHandler
}

func InitHandlers(pService *pService.FiberPrescriptionService, hService *phService.FiberPrescriptionHistoryService, mtService *mtService.FiberMedicationTypeService, cService *cService.FiberClinicService) *Handler {
	pHandler := InitializePrescriptionHandler(pService)
	historyHandler := InitializePrescriptionHistoryHandler(hService)
	mtHandler := InitializeMedicationTypeHandler(mtService)
	cHandler := InitializeClinicHandler(cService)
	return &Handler{PHandler: pHandler, HistoryHandler: historyHandler, MedicationTypeHandler: mtHandler, ClinicHandler: cHandler}
}
