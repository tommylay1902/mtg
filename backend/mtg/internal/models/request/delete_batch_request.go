package request

import "github.com/google/uuid"

type DeleteBatchPrescriptionRequest struct {
	DeleteList []uuid.UUID `json:"deleteList"`
}
