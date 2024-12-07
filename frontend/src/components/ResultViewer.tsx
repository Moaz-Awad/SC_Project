import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Trash2, Download } from 'lucide-react';
import type { ScanResult } from '../types';

interface ResultViewerProps {
  results: ScanResult[];
  onDelete: (id: string) => void;
  onSave: (result: ScanResult) => void;
}

export function ResultViewer({ results, onDelete, onSave }: ResultViewerProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No scan results yet. Upload some files to get started.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {results.map((result) => (
        <div
          key={result.id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {result.fileName}
              </h3>
              <p className="text-sm text-gray-500">{result.timestamp}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onSave(result)}
                className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-blue-50"
                title="Download results"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(result.id)}
                className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-red-50"
                title="Delete results"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="px-6 py-4 prose max-w-none">
            <ReactMarkdown>{result.content}</ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
}