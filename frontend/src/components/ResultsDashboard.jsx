import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Briefcase, Zap, FileText } from 'lucide-react';
import SkillGapAnalyzer from './SkillGapAnalyzer';

export default function ResultsDashboard({ result, onReset }) {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-accent drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]';
    if (score >= 60) return 'text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]';
    return 'text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]';
  };

  const getScoreRing = (score) => {
    if (score >= 80) return 'border-accent shadow-[0_0_30px_rgba(16,185,129,0.2)]';
    if (score >= 60) return 'border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.2)]';
    return 'border-red-400 shadow-[0_0_30px_rgba(248,113,113,0.2)]';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-6xl mx-auto w-full space-y-8"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <Zap className="text-primary" /> Analysis Results
        </h2>
        <button onClick={onReset} className="px-4 py-2 rounded-full border border-white/20 hover:bg-white/5 transition-colors">
          New Analysis
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Score Card */}
        <div className="glass-card p-8 flex flex-col items-center justify-center text-center lg:col-span-1">
          <h3 className="text-textMuted uppercase tracking-wider text-sm font-semibold mb-6">Fit Score</h3>
          <div className={`w-48 h-48 rounded-full border-4 ${getScoreRing(result.score)} flex items-center justify-center mb-6 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
            <span className={`text-6xl font-black ${getScoreColor(result.score)}`}>
              {result.score}
            </span>
          </div>
          <p className="text-lg font-medium text-white mb-2">
            Semantic Similarity: {(result.similarity * 100).toFixed(1)}%
          </p>
          <div className="mt-4 p-4 bg-surface/50 rounded-xl border border-white/5 text-sm text-textMuted text-left w-full">
            <p className="flex items-start gap-2">
              <FileText className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span>{result.summary}</span>
            </p>
          </div>
        </div>

        {/* Details Cards */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-white/10 pb-4">
              <Briefcase className="text-secondary" /> Experience Check
            </h3>
            <p className="text-lg">{result.experience_gap}</p>
          </div>

          <SkillGapAnalyzer 
            matched={result.matched_skills} 
            missing={result.missing_skills} 
          />
          
        </div>
      </div>
    </motion.div>
  );
}
