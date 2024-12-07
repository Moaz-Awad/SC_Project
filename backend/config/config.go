package config

import (
	"os"

	"github.com/joho/godotenv" //.env file
)

type Config struct {
    GroqApiKey string
}

func LoadConfig() (*Config, error) {
    err := godotenv.Load()
    if err != nil {
        return nil, err
    }

    return &Config{
        GroqApiKey: os.Getenv("GROQ_API_KEY"),
    }, nil
}