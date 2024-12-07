package main

import (
	"backend/config"
	"backend/internal/api"
	"fmt"
	"net/http"
)

func main() {
	config.ShowASCII()

	cfg, err := config.LoadConfig()
	if err != nil {
		fmt.Printf("Failed to load config: %v\n", err)
		return
	}

	handler := api.NewHandler(cfg)
	http.HandleFunc("/upload", handler.UploadHandler)

	fmt.Println("Server started at http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		fmt.Printf("Failed to start server: %v\n", err)
	}
}