export interface ScanResult {
  id: string;
  fileName: string;
  content: string;
  timestamp: string;
}

export interface FileUploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export interface Vulnerability {
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  proof_of_concept: string;
  recommended_fixes: string;
}
