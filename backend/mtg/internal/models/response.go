package models

type Response struct {
	Status     string `json:"status"`
	StatusCode int    `json:"statusCode"`
	Error      struct {
		Code       string `json:"code"`
		Message    string `json:"message"`
		Details    string `json:"details"`
		Timestamp  string `json:"timestamp"`
		Path       string `json:"path"`
		Suggestion string `json:"suggestion"`
	} `json:"error"`
}
