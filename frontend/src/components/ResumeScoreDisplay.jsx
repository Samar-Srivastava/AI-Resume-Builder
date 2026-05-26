import { getScoreLabel } from '@/lib/resumeScore';
import { Loader2, Sparkles } from 'lucide-react';
import React from 'react';

function MiniBar({ label, value, show }) {
  if (show == null) return null;
  return (
    <div className="text-left">
      <div className="flex justify-between text-xs text-slate-400 mb-0.5">
        <span>{label}</span>
        <span className="text-slate-300">{value}%</span>
      </div>
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function ResumeScoreDisplay({
  bundle,
  loading = false,
  loadingLabel = 'Analyzing content with AI…',
  showBreakdown = true,
  compact = false,
}) {
  if (loading) {
    return (
      <div
        className={`flex items-center justify-center gap-3 rounded-xl border border-slate-600 bg-slate-800/80 ${
          compact ? 'p-4' : 'p-6'
        }`}
      >
        <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
        <p className="text-sm text-slate-400">{loadingLabel}</p>
      </div>
    );
  }

  if (!bundle) return null;

  const { text, color } = getScoreLabel(bundle.overall);

  return (
    <div
      className={`rounded-xl border border-cyan-500/30 bg-slate-800/90 text-center ${
        compact ? 'p-4 max-w-md mx-auto' : 'p-6 max-w-xl mx-auto'
      }`}
    >
      <p className="text-xs uppercase tracking-widest text-cyan-400 flex items-center justify-center gap-1">
        <Sparkles className="h-3 w-3" />
        Resume score
      </p>
      <p className={`text-5xl font-extrabold mt-2 ${color}`}>{bundle.overall}</p>
      <p className={`text-sm font-medium ${color}`}>{text}</p>

      {showBreakdown && (
        <div className="mt-5 grid gap-2 text-left">
          <MiniBar label="ATS readiness" value={bundle.readiness} show={bundle.readiness} />
          <MiniBar label="Writing quality" value={bundle.heuristics} show={bundle.heuristics} />
          <MiniBar label="Keyword match" value={bundle.keyword} show={bundle.keyword} />
          <MiniBar label="Semantic job fit" value={bundle.semantic} show={bundle.semantic} />
          <MiniBar label="AI content review" value={bundle.llm} show={bundle.llm} />
        </div>
      )}

      {bundle.llmSummary && (
        <p className="mt-4 text-sm text-slate-300 italic border-t border-slate-700 pt-3">
          {bundle.llmSummary}
        </p>
      )}

      {bundle.improvements?.length > 0 && (
        <ul className="mt-3 text-xs text-left text-amber-200/90 space-y-1 list-disc list-inside">
          {bundle.improvements.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}

      {!bundle.llm && (
        <p className="mt-3 text-xs text-slate-500">
          Sign in for AI content review and semantic job matching.
        </p>
      )}
    </div>
  );
}
