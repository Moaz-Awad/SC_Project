import React, { useState } from "react";
import { Shield } from "lucide-react";
import { FileUpload } from "./components/FileUpload";
import { ResultViewer } from "./components/ResultViewer";
import type { ScanResult, FileUploadState } from "./types";

function App() {
  const [results, setResults] = useState<ScanResult[]>([]);
  const [uploadState, setUploadState] = useState<FileUploadState>({
    isUploading: false,
    progress: 0,
    error: null,
  });

  const handleFilesSelected = async (files: File[]) => {
    setUploadState({ isUploading: true, progress: 0, error: null });

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      // Simulate progress while uploading
      const progressInterval = setInterval(() => {
        setUploadState((prev) => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90), // Increment up to 90%
        }));
      }, 200);

      const response = await fetch("http://localhost:8080/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval); // Stop progress simulation

      if (!response.ok) {
        throw new Error("Failed to upload files");
      }

      const analysisResults = await response.json();

      // Set progress to 100% when complete
      setUploadState((prev) => ({ ...prev, progress: 100 }));

      const newResults = analysisResults.map(
        (content: string, index: number) => ({
          id: crypto.randomUUID(),
          fileName: files[index].name,
          content,
          timestamp: new Date().toLocaleString(),
        })
      );

      // Small delay before hiding progress bar
      setTimeout(() => {
        setResults((prev) => [...prev, ...newResults]);
        setUploadState({ isUploading: false, progress: 0, error: null });
      }, 500);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadState({
        isUploading: false,
        progress: 0,
        error: "Failed to process files. Please try again.",
      });
    }
  };

  const handleDelete = (id: string) => {
    setResults((prev) => prev.filter((result) => result.id !== id));
  };

  const handleSave = (result: ScanResult) => {
    const blob = new Blob([result.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.fileName}-security-analysis.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">
              Security Scanner
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <section>
            <FileUpload onFilesSelected={handleFilesSelected} />

            {uploadState.isUploading && (
              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-300 ease-out"
                    style={{
                      width: `${uploadState.progress}%`,
                      transition: "width 200ms ease-in-out",
                    }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {uploadState.progress < 100
                    ? "Processing files..."
                    : "Upload complete!"}
                </p>
              </div>
            )}

            {uploadState.error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
                {uploadState.error}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Scan Results
            </h2>
            <ResultViewer
              results={results}
              onDelete={handleDelete}
              onSave={handleSave}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
