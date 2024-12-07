export interface ApiResponse {
  results: Array<{
    fileName: string;
    content: string;
    error?: string;
  }>;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}