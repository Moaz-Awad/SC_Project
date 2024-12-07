import React from 'react';

interface ProgressBarProps {
  progress: number;
  isComplete: boolean;
}

export function ProgressBar({ progress, isComplete }: ProgressBarProps) {
  return (
    <div className="mt-4">
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-300 ease-out"
          style={{
            width: `${progress}%`,
            transition: "width 200ms ease-in-out",
          }}
        />
      </div>
      <p className="text-sm text-gray-600 mt-2">
        {isComplete ? "Upload complete!" : "Processing files..."}
      </p>
    </div>
  );
}