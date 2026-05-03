import React, { useState } from 'react';
import axios from 'axios';
import UploadSection from './components/UploadSection';
import ResultsDashboard from './components/ResultsDashboard';

// Define the API base URL (can be customized via env later)
const API_URL = "http://localhost:8000";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async (resumeFile, jobDescriptionText) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("job_description", jobDescriptionText);

    try {
      const response = await axios.post(`${API_URL}/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "An error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen relative py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh]">
        
        {error && (
          <div className="mb-8 p-4 glass-card border-red-500/50 text-red-200 max-w-4xl w-full text-center">
            {error}
          </div>
        )}

        {!result ? (
          <UploadSection onAnalyze={handleAnalyze} isLoading={isLoading} />
        ) : (
          <ResultsDashboard result={result} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}

export default App;
