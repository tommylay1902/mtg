package handler

import (
	mtService "mtg/internal/server/service/medication_type"
	pService "mtg/internal/server/service/prescription"
	phService "mtg/internal/server/service/prescriptionhistory"
)

type Handler struct {
	PHandler              *PrescriptionHandler
	HistoryHandler        *PrescriptionHistoryHandler
	MedicationTypeHandler *MedicationTypeHandler
}

func InitHandlers(pService *pService.FiberPrescriptionService, hService *phService.FiberPrescriptionHistoryService, mtService *mtService.FiberMedicationTypeService) *Handler {
	pHandler := InitializePrescriptionHandler(pService)
	historyHandler := InitializePrescriptionHistoryHandler(hService)
	mtHandler := InitializeMedicationTypeHandler(mtService)
	return &Handler{PHandler: pHandler, HistoryHandler: historyHandler, MedicationTypeHandler: mtHandler}
}
