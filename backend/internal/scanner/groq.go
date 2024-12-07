package scanner

import (
	"backend/config"
	"backend/internal/markdown"
	"fmt"
	"path/filepath"

	"github.com/jpoz/groq"
)

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