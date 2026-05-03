import React, { useState } from 'react';
import { Upload, FileText, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UploadSection({ onAnalyze, isLoading }) {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (resume && jobDescription) {
      onAnalyze(resume, jobDescription);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto w-full glass-card p-8"
    >
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4">
          FitScore
        </h1>
        <p className="text-textMuted text-lg">AI-Powered Resume Screening & Analysis</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Resume Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-textMuted uppercase tracking-wider">
              1. Upload Resume (PDF)
            </label>
            <div className="relative group">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-300 ${resume ? 'border-accent bg-accent/5' : 'border-white/20 group-hover:border-primary/50 group-hover:bg-primary/5'}`}>
                {resume ? (
                  <>
                    <FileText className="w-12 h-12 text-accent mb-3" />
                    <p className="text-accent font-medium text-center px-4 truncate w-full">{resume.name}</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-textMuted mb-3 group-hover:text-primary transition-colors" />
                    <p className="text-textMuted">Drag & drop or click to browse</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-textMuted uppercase tracking-wider">
              2. Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full h-48 bg-surface/50 border border-white/10 rounded-xl p-4 text-text placeholder-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none"
              required
            />
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={!resume || !jobDescription || isLoading}
            className="group relative px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-full font-bold text-lg overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-105 active:scale-95 flex items-center gap-3 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Analyzing Match...
              </>
            ) : (
              <>
                Analyze Candidate
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
