export class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown): Error {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return new ApiError('Unable to connect to the server. Please check if the backend is running.');
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError('An unexpected error occurred');
}