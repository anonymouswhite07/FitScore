import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

export default function SkillGapAnalyzer({ matched, missing }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Matched Skills */}
      <div className="glass-card p-6 border-t-4 border-t-accent">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-accent">
          <CheckCircle2 /> Matched Skills ({matched.length})
        </h3>
        <div className="flex flex-wrap gap-2">
          {matched.length > 0 ? matched.map((skill, idx) => (
            <span key={idx} className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium border border-accent/20">
              {skill}
            </span>
          )) : (
            <p className="text-textMuted text-sm">No specific core skills matched.</p>
          )}
        </div>
      </div>

      {/* Missing Skills */}
      <div className="glass-card p-6 border-t-4 border-t-red-400">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-400">
          <AlertTriangle /> Missing / Recommended ({missing.length})
        </h3>
        <div className="flex flex-wrap gap-2">
          {missing.length > 0 ? missing.map((skill, idx) => (
            <span key={idx} className="px-3 py-1 bg-red-400/10 text-red-400 rounded-full text-sm font-medium border border-red-400/20">
              {skill}
            </span>
          )) : (
            <p className="text-textMuted text-sm">
              {matched.length > 0 
                ? "All required core skills are present!" 
                : "No specific skills detected in Job Description."}
            </p>
          )}
        </div>
        {missing.length > 0 && (
          <div className="mt-6 p-4 bg-red-400/5 rounded-lg border border-red-400/10">
            <p className="text-sm text-red-200">
              <strong>Recommendation:</strong> Upskilling in these missing areas will significantly improve the candidate's fit for this role.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
