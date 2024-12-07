package scanner

import (
	"backend/config"
	"backend/internal/markdown"
	"fmt"
	"path/filepath"

	"github.com/jpoz/groq"
)

type Scanner struct {
	client *groq.Client
	config *config.Config
}

func NewScanner(config *config.Config) *Scanner {
	return &Scanner{
		client: groq.NewClient(groq.WithAPIKey(config.GroqApiKey)),
		config: config,
	}
}

func (s *Scanner) ScanCode(input ScanInput) ScanOutput {
	prompt := formatPrompt(string(input.Content))
	
	messages := []groq.Message{
		{Role: "user", Content: prompt},
	}

	response, err := s.client.CreateChatCompletion(groq.CompletionCreateParams{
		Model:    "llama-3.1-70b-versatile",
		Messages: messages,
	})
	
	if err != nil {
		return ScanOutput{Error: fmt.Errorf("scan failed: %v", err)}
	}

	content := response.Choices[0].Message.Content
	resultFile := filepath.Join("output", input.FileName+".md")
	
	if err := markdown.SaveMarkdown(resultFile, content); err != nil {
		return ScanOutput{Error: fmt.Errorf("failed to save results: %v", err)}
	}

	return ScanOutput{Content: content}
}