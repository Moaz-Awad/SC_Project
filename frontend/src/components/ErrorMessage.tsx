import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex items-center gap-2 p-4 text-red-700 bg-red-50 rounded-md">
      <AlertCircle className="w-5 h-5" />
      <span>{message}</span>
    </div>
  );
}