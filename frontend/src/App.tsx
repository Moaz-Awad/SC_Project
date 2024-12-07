import React from "react";
import { Shield } from "lucide-react";
import { FileUpload } from "./components/FileUpload";
import { ResultViewer } from "./components/ResultViewer";
import { useUpload } from "./hooks/useUpload";

function App() {
  const { results, uploadState, handleFilesSelected, handleDelete, handleSave } = useUpload();

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
            <FileUpload 
              onFilesSelected={handleFilesSelected} 
              uploadState={uploadState}
            />
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