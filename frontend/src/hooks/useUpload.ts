import { useState, useCallback } from 'react';
import type { FileUploadState, ScanResult } from '../types';
import { uploadFiles } from '../services/api';
import { ApiError } from '../utils/error';
import { getOversizedFiles, createDownloadLink } from '../utils/file';
import { createProgressTracker } from '../utils/progress';
import { UPLOAD_STATES } from '../utils/constants';

export function useUpload() {
  const [results, setResults] = useState<ScanResult[]>([]);
  const [uploadState, setUploadState] = useState<FileUploadState>({
    isUploading: false,
    progress: 0,
    error: null,
  });

  const handleFilesSelected = useCallback(async (files: File[]) => {
    const oversizedFiles = getOversizedFiles(files);
    if (oversizedFiles.length > 0) {
      setUploadState({
        isUploading: false,
        progress: 0,
        error: `Files exceeding 5MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`,
      });
      return;
    }

    setUploadState({ isUploading: true, progress: 0, error: null });

    try {
      const progressTracker = createProgressTracker();
      progressTracker.start((progress) => 
        setUploadState(prev => ({ ...prev, progress }))
      );

      const analysisResults = await uploadFiles(files);
      progressTracker.stop();

      setUploadState(prev => ({ ...prev, progress: UPLOAD_STATES.COMPLETE_PROGRESS }));

      const newResults = analysisResults.map((content: string, index: number) => ({
        id: crypto.randomUUID(),
        fileName: files[index].name,
        content,
        timestamp: new Date().toLocaleString(),
      }));

      setTimeout(() => {
        setResults(prev => [...prev, ...newResults]);
        setUploadState({ isUploading: false, progress: 0, error: null });
      }, UPLOAD_STATES.COMPLETION_DELAY);
    } catch (error) {
      const apiError = error instanceof ApiError ? error : new ApiError('Failed to process files');
      console.error("Upload error:", apiError);
      
      setUploadState({
        isUploading: false,
        progress: 0,
        error: apiError.message,
      });
    }
  }, []);

  const handleDelete = useCallback((id: string) => {
    setResults(prev => prev.filter(result => result.id !== id));
  }, []);

  const handleSave = useCallback((result: ScanResult) => {
    createDownloadLink(result.content, result.fileName);
  }, []);

  return {
    results,
    uploadState,
    handleFilesSelected,
    handleDelete,
    handleSave,
  };
}