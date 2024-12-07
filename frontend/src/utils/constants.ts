export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080',
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_FILE_TYPES: {
    'text/plain': ['.txt', '.js', '.ts', '.jsx', '.tsx', '.json', '.html', '.css'],
    'application/json': ['.json'],
    'text/javascript': ['.js', '.jsx'],
    'text/typescript': ['.ts', '.tsx']
  }
} as const;

export const UPLOAD_STATES = {
  PROGRESS_INTERVAL: 200,
  MAX_PROGRESS: 90,
  COMPLETE_PROGRESS: 100,
  COMPLETION_DELAY: 500
} as const;