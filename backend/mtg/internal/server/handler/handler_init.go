package handler

import "mtg/internal/server/service"

type Handler struct {
	PHandler *PrescriptionHandler
}

func InitHandlers(pService *service.FiberPrescriptionService) *Handler {
	pHandler := InitializePrescriptionHandler(pService)

	return &Handler{PHandler: pHandler}
}
