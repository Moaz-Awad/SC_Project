import React from "react";
import {
  FileText,
  Clock,
  Download,
  Trash2,
  AlertTriangle,
  AlertCircle,
  AlertOctagon,
} from "lucide-react";
import type { ScanResult } from "../types";
import ReactMarkdown from "react-markdown";

interface ResultViewerProps {
  results: ScanResult[];
  onDelete: (id: string) => void;
  onSave: (result: ScanResult) => void;
}

export function ResultViewer({ results, onDelete, onSave }: ResultViewerProps) {
  const getSeverityColor = (content: string): string => {
    if (content.toLowerCase().includes("critical")) return "text-red-600";
    if (content.toLowerCase().includes("high")) return "text-orange-500";
    if (content.toLowerCase().includes("medium")) return "text-yellow-500";
    return "text-green-500";
  };

  const getSeverityIcon = (content: string) => {
    if (content.toLowerCase().includes("critical"))
      return <AlertOctagon className="w-5 h-5 text-red-600" />;
    if (content.toLowerCase().includes("high"))
      return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    if (content.toLowerCase().includes("medium"))
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    return <AlertCircle className="w-5 h-5 text-green-500" />;
  };

  if (results.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500">
          No scan results yet. Upload files to begin analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {results.map((result) => (
        <div
          key={result.id}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="border-b border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getSeverityIcon(result.content)}
                <h3 className="text-lg font-semibold text-gray-800">
                  {result.fileName}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSave(result)}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Download className="w-4 h-4 mr-1.5" />
                  Save
                </button>
                <button
                  onClick={() => onDelete(result.id)}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  Delete
                </button>
              </div>
            </div>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {result.timestamp}
            </div>
          </div>
          <div className="p-6">
            <div className="prose max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="text-2xl font-bold mb-4" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-xl font-semibold mt-6 mb-3"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-lg font-medium mt-4 mb-2" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc pl-6 mb-4" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="mb-1" {...props} />
                  ),
                  p: ({ node, ...props }) => <p className="mb-4" {...props} />,
                }}
              >
                {result.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
