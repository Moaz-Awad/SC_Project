import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { ErrorMessage } from './ErrorMessage';
import { ProgressBar } from './ProgressBar';
import type { FileUploadState } from '../types';
import { API_CONFIG } from '../utils/constants';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  uploadState: FileUploadState;
}

export function FileUpload({ onFilesSelected, uploadState }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesSelected(acceptedFiles);
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: API_CONFIG.SUPPORTED_FILE_TYPES,
    maxSize: API_CONFIG.MAX_FILE_SIZE,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">
          {isDragActive
            ? 'Drop the files here...'
            : 'Drag and drop files here, or click to select files'}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Supported files: .js, .ts, .jsx, .tsx, .json, .html, .css (max 5MB)
        </p>
      </div>

      {uploadState.isUploading && (
        <ProgressBar 
          progress={uploadState.progress} 
          isComplete={uploadState.progress === 100} 
        />
      )}

      {uploadState.error && (
        <ErrorMessage message={uploadState.error} />
      )}
    </div>
  );
}