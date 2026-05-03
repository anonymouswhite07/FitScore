import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Briefcase, Zap, FileText } from 'lucide-react';
import SkillGapAnalyzer from './SkillGapAnalyzer';

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

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
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto w-full space-y-10"
    >
      {/* Header Card */}
      <motion.div variants={itemVariants} className="liquid-glass p-12 relative">
        <div className="absolute top-0 right-0 p-8">
          <button 
            onClick={onReset}
            className="p-3 rounded-full bg-white/5 border border-white/10 text-textMuted hover:text-white hover:bg-white/10 transition-all active:scale-90"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-12 gap-12 items-center">
          {/* Score Circle Area */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-64 h-64">
              {/* Outer Glow Ring */}
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse"></div>
              <div className="absolute inset-2 rounded-full border border-white/5"></div>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-2">Fit Score</span>
                <span className="text-7xl font-black text-white tracking-tighter">{result.score}</span>
                <div className="mt-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                  <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">Analysis Ready</span>
                </div>
              </div>
              
              {/* Liquid Progress Path */}
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="128" cy="128" r="120"
                  fill="none"
                  stroke="url(#liquidGradient)"
                  strokeWidth="8"
                  strokeDasharray={`${(result.score / 100) * 754} 754`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00D2FF" />
                    <stop offset="100%" stopColor="#9D50BB" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Metrics Area */}
          <div className="md:col-span-7 space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-[2px] bg-primary"></div>
                <h2 className="text-sm font-black text-white uppercase tracking-[0.4em]">Evaluation Summary</h2>
              </div>
              <p className="text-xl text-text leading-relaxed font-medium">
                {result.summary}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-[1.5rem] bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-secondary/20 text-secondary">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black text-textMuted uppercase tracking-widest">Similarity</span>
                </div>
                <div className="text-3xl font-black text-white">{(result.similarity * 100).toFixed(1)}%</div>
              </div>

              <div className="p-6 rounded-[1.5rem] bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-accent/20 text-accent">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black text-textMuted uppercase tracking-widest">Experience</span>
                </div>
                <div className="text-3xl font-black text-white">
                  {result.experience_gap >= 0 ? `+${result.experience_gap} yrs` : `${result.experience_gap} yrs`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SkillGapAnalyzer matched={result.matched_skills} missing={result.missing_skills} />
    </motion.div>
  );

