export interface FileUploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export interface ScanResult {
  id: string;
  fileName: string;
  content: string;
  timestamp: string;
}