import { API_CONFIG } from './constants';

export function validateFileSize(file: File): boolean {
  return file.size <= API_CONFIG.MAX_FILE_SIZE;
}

export function getOversizedFiles(files: File[]): File[] {
  return files.filter(file => !validateFileSize(file));
}

export function createDownloadLink(content: string, fileName: string): void {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}-security-analysis.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}