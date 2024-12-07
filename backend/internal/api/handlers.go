package api

import (
	"backend/config"
	"backend/internal/scanner"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

type Handler struct {
	scanner *scanner.Scanner
}

func NewHandler(config *config.Config) *Handler {
	return &Handler{
		scanner: scanner.NewScanner(config),
	}
}

func (h *Handler) UploadHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Add CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		return
	}

	err := r.ParseMultipartForm(10 << 20) // 10 MB
	if err != nil {
		http.Error(w, "Error parsing form data", http.StatusBadRequest)
		return
	}

	files := r.MultipartForm.File["files"]
	response := ScanResponse{Results: make([]ScanResult, 0, len(files))}

	for _, fileHeader := range files {
		file, err := fileHeader.Open()
		if err != nil {
			response.Results = append(response.Results, ScanResult{
				FileName: fileHeader.Filename,
				Error:    fmt.Sprintf("Error opening file: %v", err),
			})
			continue
		}
		defer file.Close()

		content, err := ioutil.ReadAll(file)
		if err != nil {
			response.Results = append(response.Results, ScanResult{
				FileName: fileHeader.Filename,
				Error:    fmt.Sprintf("Error reading file: %v", err),
			})
			continue
		}

		result := h.scanner.ScanCode(scanner.ScanInput{
			FileName: fileHeader.Filename,
			Content:  content,
		})

		if result.Error != nil {
			response.Results = append(response.Results, ScanResult{
				FileName: fileHeader.Filename,
				Error:    result.Error.Error(),
			})
			continue
		}

		response.Results = append(response.Results, ScanResult{
			FileName: fileHeader.Filename,
			Content:  result.Content,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}