import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

export default function SkillGapAnalyzer({ matched, missing }) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Matched Skills */}
      <div className="liquid-glass p-8 border-t-2 border-accent">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-black text-accent uppercase tracking-[0.3em] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> Matched Skills
          </h3>
          <span className="px-3 py-1 bg-accent/10 rounded-full text-[10px] font-black text-accent">{matched.length}</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {matched.length > 0 ? matched.map((skill, idx) => (
            <span key={idx} className="px-4 py-2 bg-white/5 text-accent rounded-full text-xs font-black border border-white/10 hover:border-accent/40 hover:bg-accent/5 transition-all cursor-default">
              {skill}
            </span>
          )) : (
            <p className="text-textMuted text-xs font-medium italic opacity-50">No core skill alignment detected.</p>
          )}
        </div>
      </div>

      {/* Missing Skills */}
      <div className="liquid-glass p-8 border-t-2 border-primary">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Skill Gaps
          </h3>
          <span className="px-3 py-1 bg-primary/10 rounded-full text-[10px] font-black text-primary">{missing.length}</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {missing.length > 0 ? missing.map((skill, idx) => (
            <span key={idx} className="px-4 py-2 bg-white/5 text-primary rounded-full text-xs font-black border border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-default">
              {skill}
            </span>
          )) : (
            <p className="text-textMuted text-xs font-medium italic opacity-50">
              {matched.length > 0 
                ? "Perfect skill alignment achieved." 
                : "Awaiting skill identification."}
            </p>
          )}
        </div>
        {missing.length > 0 && (
          <div className="mt-8 p-4 bg-primary/5 rounded-[1rem] border border-primary/10 flex items-start gap-3">
            <div className="w-1 h-8 bg-primary rounded-full shrink-0"></div>
            <p className="text-[11px] text-textMuted leading-relaxed font-medium">
              Developing expertise in these areas is highly recommended for optimal role performance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
