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
      className="max-w-4xl mx-auto w-full liquid-glass p-10"
    >
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Resume Upload */}
          <div className="space-y-4">
            <label className="block text-xs font-black text-primary uppercase tracking-[0.2em] ml-1">
              01. Upload Resume
            </label>
            <div className="relative group">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`h-56 border border-white/10 rounded-[1.5rem] flex flex-col items-center justify-center transition-all duration-500 bg-white/5 backdrop-blur-md overflow-hidden ${resume ? 'border-accent/40 shadow-accent/10' : 'group-hover:border-primary/40 group-hover:bg-primary/5'}`}>
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {resume ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4 glow-accent">
                      <FileText className="w-8 h-8 text-accent" />
                    </div>
                    <p className="text-accent font-bold text-center px-6 truncate w-full tracking-tight">{resume.name}</p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                      <Upload className="w-8 h-8 text-textMuted group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-textMuted font-medium">Drop PDF file here</p>
                    <p className="text-xs text-textMuted/50 mt-2 uppercase tracking-widest">Max 5MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-4">
            <label className="block text-xs font-black text-secondary uppercase tracking-[0.2em] ml-1">
              02. Job Description
            </label>
            <div className="relative">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the requirements..."
                className="w-full h-56 bg-white/5 border border-white/10 rounded-[1.5rem] p-6 text-text placeholder-white/10 focus:outline-none focus:border-secondary/40 focus:ring-4 focus:ring-secondary/5 transition-all resize-none font-medium leading-relaxed"
                required
              />
              <div className="absolute bottom-4 right-4 text-[10px] font-black text-textMuted/30 tracking-widest uppercase">
                Input Required
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={!resume || !jobDescription || isLoading}
            className="group relative px-10 py-5 bg-white text-background rounded-full font-black text-sm tracking-[0.2em] uppercase overflow-hidden disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-primary/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-500">
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Analyze Fit
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
          </button>
        </div>
      </form>
    </motion.div>
  );
}
