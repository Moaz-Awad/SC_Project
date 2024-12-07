import type { ApiResponse } from './types';
import { handleApiError } from '../utils/error';
import { API_CONFIG } from '../utils/constants';

export async function uploadFiles(files: File[]): Promise<string[]> {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await fetch(`${API_CONFIG.BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    
    if (!data.results) {
      throw new Error('Invalid response format from server');
    }

    return data.results.map(result => {
      if (result.error) {
        throw new Error(`Error processing ${result.fileName}: ${result.error}`);
      }
      return result.content;
    });
  } catch (error) {
    throw handleApiError(error);
  }
}