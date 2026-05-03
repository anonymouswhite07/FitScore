// FitScore v2.0 - LiquidGlass Edition
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
    <div className="min-h-screen relative py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-background">
      {/* LiquidGlass Animated Background Blobs */}
      <div className="bg-blob w-[500px] h-[500px] bg-primary/20 top-[-100px] left-[-100px] animate-blob"></div>
      <div className="bg-blob w-[400px] h-[400px] bg-secondary/20 bottom-[-100px] right-[-100px] animate-blob animation-delay-2000"></div>
      <div className="bg-blob w-[300px] h-[300px] bg-accent/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-blob animation-delay-4000"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] w-full max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary mb-2 animate-pulse">
            FitScore
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
        </header>

        {error && (
          <div className="mb-8 p-6 liquid-glass border-red-500/50 text-red-200 max-w-4xl w-full text-center">
            {error}
          </div>
        )}

        {!result ? (
          <UploadSection onAnalyze={handleAnalyze} isLoading={isLoading} />
        ) : (
          <ResultsDashboard result={result} onReset={handleReset} />
        )}

        <footer className="mt-20 py-8 px-10 liquid-glass flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl w-full">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-[10px] font-black text-primary">FS</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">FitScore v2.0</p>
              <p className="text-[8px] font-bold text-textMuted uppercase tracking-widest">LiquidGlass Engine Active</p>
            </div>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-[10px] font-black text-textMuted uppercase tracking-widest hover:text-primary transition-colors">Documentation</a>
            <a href="#" className="text-[10px] font-black text-textMuted uppercase tracking-widest hover:text-primary transition-colors">API Keys</a>
            <a href="#" className="text-[10px] font-black text-textMuted uppercase tracking-widest hover:text-primary transition-colors">Support</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
