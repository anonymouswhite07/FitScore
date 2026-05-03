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
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative group"
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`h-64 border-2 border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center transition-all duration-700 bg-white/5 backdrop-blur-3xl overflow-hidden ${resume ? 'border-accent/40 shadow-[0_0_40px_rgba(0,242,96,0.1)]' : 'group-hover:border-primary/40 group-hover:bg-primary/5'}`}>
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                {resume ? (
                  <>
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(0,242,96,0.2)]"
                    >
                      <FileText className="w-10 h-10 text-accent" />
                    </motion.div>
                    <p className="text-accent font-black text-center px-8 truncate w-full tracking-tight text-sm">{resume.name}</p>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-700">
                      <Upload className="w-10 h-10 text-textMuted group-hover:text-primary transition-colors duration-500" />
                    </div>
                    <p className="text-textMuted font-bold tracking-tight">Drop Resume Here</p>
                    <p className="text-[10px] text-textMuted/40 mt-2 uppercase tracking-[0.3em] font-black">PDF Format • Max 5MB</p>
                  </>
                )}
              </div>
            </motion.div>
          </div>

          {/* Job Description */}
          <div className="space-y-4">
            <label className="block text-xs font-black text-secondary uppercase tracking-[0.2em] ml-1">
              02. Job Description
            </label>
            <div className="relative group">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Describe the ideal candidate..."
                className="w-full h-64 bg-white/5 border border-white/5 rounded-[2.5rem] p-8 text-text placeholder-white/10 focus:outline-none focus:border-secondary/40 focus:ring-[12px] focus:ring-secondary/5 transition-all resize-none font-bold leading-relaxed shadow-inner"
                required
              />
              <div className="absolute bottom-6 right-8 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></div>
                <span className="text-[10px] font-black text-textMuted/40 tracking-[0.2em] uppercase">Requirements Engine</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={!resume || !jobDescription || isLoading}
            className="group relative px-12 py-6 bg-white text-background rounded-full font-black text-xs tracking-[0.3em] uppercase overflow-hidden disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-primary/30"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-0 group-hover:opacity-100 transition-all duration-700 animate-gradient-x"></div>
            <span className="relative z-10 flex items-center gap-4 group-hover:text-white transition-colors duration-500">
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Vector Space...
                </>
              ) : (
                <>
                  Initiate Fit Analysis
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
                </>
              )}
            </span>
          </button>
        </div>
      </form>
    </motion.div>
  );
}
