import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ResumeScoreDisplay from '@/components/ResumeScoreDisplay';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import {
  combineResumeScores,
  computeClientScoreBundle,
  computeContentHeuristics,
  JD_STORAGE_KEY,
} from '@/lib/resumeScore';
import { computeAtsScore } from '@/lib/atsScore';
import { scoreResumeWithAI } from '../../../../service/AIModal';
import { useUser } from '@clerk/clerk-react';
import { CheckCircle2, ClipboardList, Loader2, Sparkles, XCircle } from 'lucide-react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function AtsPanel() {
  const { resumeInfo } = useContext(ResumeInfoContext);
  const { resumeId } = useParams();
  const { isSignedIn } = useUser();
  const [jobDescription, setJobDescription] = useState('');
  const [expanded, setExpanded] = useState(true);
  const [aiBundle, setAiBundle] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (resumeId) {
      const saved = sessionStorage.getItem(JD_STORAGE_KEY(resumeId));
      if (saved) setJobDescription(saved);
    }
  }, [resumeId]);

  useEffect(() => {
    if (resumeId && jobDescription) {
      sessionStorage.setItem(JD_STORAGE_KEY(resumeId), jobDescription);
    }
  }, [jobDescription, resumeId]);

  const readiness = useMemo(
    () => computeAtsScore(resumeInfo, jobDescription),
    [resumeInfo, jobDescription]
  );

  const heuristics = useMemo(
    () => computeContentHeuristics(resumeInfo),
    [resumeInfo]
  );

  const clientBundle = useMemo(() => {
    const base = computeClientScoreBundle(resumeInfo, jobDescription);
    if (aiBundle) {
      return {
        ...base,
        overall: combineResumeScores({
          readiness: base.readiness,
          heuristics: base.heuristics,
          keyword: base.keyword,
          semantic: aiBundle.semantic,
          llm: aiBundle.llm,
        }),
        semantic: aiBundle.semantic,
        llm: aiBundle.llm,
        llmSummary: aiBundle.llmSummary,
        improvements: aiBundle.improvements,
      };
    }
    return base;
  }, [resumeInfo, jobDescription, aiBundle]);

  const runDeepAnalyze = async () => {
    if (!isSignedIn) {
      toast.error('Sign in to run AI content scoring');
      return;
    }
    setAiLoading(true);
    try {
      const ai = await scoreResumeWithAI(resumeInfo, jobDescription);
      setAiBundle({
        semantic: ai.semantic ?? null,
        llm: ai.llmScore ?? null,
        llmSummary: ai.summary || null,
        improvements: ai.improvements || [],
      });
      toast.success('Content score updated');
    } catch {
      toast.error('AI scoring failed. Try again.');
    } finally {
      setAiLoading(false);
    }
  };

  if (!expanded) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="w-full border-slate-600 text-cyan-400"
        onClick={() => setExpanded(true)}
      >
        <ClipboardList className="h-4 w-4 mr-2" />
        Score: {clientBundle.overall}%
      </Button>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <ResumeScoreDisplay
        bundle={clientBundle}
        loading={aiLoading}
        loadingLabel="Running AI + semantic analysis…"
        compact
        showBreakdown
      />

      <div className="rounded-xl border border-slate-600 bg-slate-800 p-4 text-gray-200">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-white flex items-center gap-2 text-sm">
            <ClipboardList className="h-4 w-4 text-cyan-400" />
            ATS checklist
          </h3>
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="text-slate-500 hover:text-slate-300 text-xs"
          >
            Collapse
          </button>
        </div>

        <div className="mt-2">
          <label className="text-xs font-medium text-slate-400">
            Job description (powers keyword + semantic match)
          </label>
          <Textarea
            className="mt-1 bg-slate-700 border-slate-600 text-white text-xs min-h-[72px]"
            placeholder="Paste the job posting here…"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        {isSignedIn && (
          <Button
            size="sm"
            className="w-full mt-3 bg-gradient-to-r from-cyan-600 to-indigo-600"
            onClick={runDeepAnalyze}
            disabled={aiLoading}
          >
            {aiLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Analyze content with AI
          </Button>
        )}

        <p className="text-xs text-slate-500 mt-2">
          Writing: {heuristics.score}% · Readiness: {readiness.score}%
        </p>

        <ul className="mt-3 space-y-2 max-h-36 overflow-y-auto">
          {readiness.checks.slice(0, 6).map((check) => (
            <li key={check.id} className="flex gap-2 text-xs items-start">
              {check.pass ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-slate-500 shrink-0" />
              )}
              <span className={check.pass ? 'text-slate-300' : 'text-slate-500'}>
                {check.label}
              </span>
            </li>
          ))}
        </ul>

        {!readiness.isMinimal && (
          <p className="mt-2 text-xs text-amber-400/90">
            Tip: Use the <strong>Minimal</strong> template for ATS parsing.
          </p>
        )}
      </div>
    </div>
  );
}
