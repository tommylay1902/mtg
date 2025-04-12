package handler

import (
	pService "mtg/internal/server/service/prescription"
	phService "mtg/internal/server/service/prescriptionhistory"
)

type Handler struct {
	PHandler       *PrescriptionHandler
	HistoryHandler *PrescriptionHistoryHandler
}

func InitHandlers(pService *pService.FiberPrescriptionService, hService *phService.FiberPrescriptionHistoryService) *Handler {

	pHandler := InitializePrescriptionHandler(pService)
	historyHandler := InitializePrescriptionHistoryHandler(hService)
	return &Handler{PHandler: pHandler, HistoryHandler: historyHandler}
}
