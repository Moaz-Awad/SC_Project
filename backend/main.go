package main

import (
	"backend/config"
	"backend/internal/markdown"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"path/filepath"

	"github.com/jpoz/groq"
)

func main() {
  http.HandleFunc("/upload", uploadHandler)
  fmt.Println("Server started at http://localhost:8080")
  if err := http.ListenAndServe(":8080", nil); err != nil {
    fmt.Println("Failed to start server:", err)
  }
}

func uploadHandler(w http.ResponseWriter, r *http.Request) {
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
    fmt.Println("Error parsing form data:", err)
    return
  }

  files := r.MultipartForm.File["files"]
  var results []string

  for _, fileHeader := range files {
    file, err := fileHeader.Open()
    if err != nil {
      http.Error(w, "Error opening file", http.StatusInternalServerError)
      fmt.Println("Error opening file:", err)
      return
    }
    defer file.Close()

    content, err := ioutil.ReadAll(file)
    if err != nil {
      http.Error(w, "Error reading file", http.StatusInternalServerError)
      fmt.Println("Error reading file:", err)
      return
    }

    result, err := scanFile(content, fileHeader.Filename)
    if err != nil {
      http.Error(w, "Error scanning file", http.StatusInternalServerError)
      fmt.Println("Error scanning file:", err)
      return
    }

    results = append(results, result)
  }

  w.Header().Set("Content-Type", "application/json")
  json.NewEncoder(w).Encode(results)
}
func scanFile(content []byte, filename string) (string, error) {
  config, err := config.LoadConfig()
  if err != nil {
    return "", fmt.Errorf("failed to load config: %v", err)
  }

  client := groq.NewClient(groq.WithAPIKey(config.GroqApiKey))

  prompt := `Please analyze the following code for vulnerabilities and provide the results in the following format:
  1. **Vulnerabilities**: List of identified vulnerabilities.
  2. **Proof of Concept**: Example of how the vulnerability can be exploited.
  3. **Recommended Fixes**: Suggestions to fix the vulnerabilities.
  4. **Code Quality**: General comments on code quality and best practices.

  Code:
  ` + string(content)

  messages := []groq.Message{
    {Role: "user", Content: prompt},
  }

  response, err := client.CreateChatCompletion(groq.CompletionCreateParams{
    Model:    "llama-3.1-70b-versatile",
    Messages: messages,
  })
  if err != nil {
    return "", err
  }

  resultFile := filepath.Join("output", filename+".md")
  err = markdown.SaveMarkdown(resultFile, response.Choices[0].Message.Content)
  if err != nil {
    return "", err
  }

  return response.Choices[0].Message.Content, nil
}