import { useEffect, useState } from 'react';
import { scoreResumeWithAI } from '../../service/AIModal';
import {
  combineResumeScores,
  computeClientScoreBundle,
  JD_STORAGE_KEY,
} from '@/lib/resumeScore';

export function useResumeScore(resumeInfo, resumeId, { enabled = true, isSignedIn = false } = {}) {
  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled || !resumeInfo) {
      setBundle(null);
      return;
    }

    const jobDescription =
      typeof window !== 'undefined' && resumeId
        ? sessionStorage.getItem(JD_STORAGE_KEY(resumeId)) || ''
        : '';

    const client = computeClientScoreBundle(resumeInfo, jobDescription);
    setBundle(client);

    if (!isSignedIn) return;

    let cancelled = false;
    setLoading(true);

    scoreResumeWithAI(resumeInfo, jobDescription)
      .then((ai) => {
        if (cancelled) return;
        const overall = combineResumeScores({
          readiness: client.readiness,
          heuristics: client.heuristics,
          keyword: client.keyword,
          semantic: ai.semantic ?? null,
          llm: ai.llmScore ?? null,
        });
        setBundle({
          ...client,
          overall,
          semantic: ai.semantic ?? null,
          llm: ai.llmScore ?? null,
          llmSummary: ai.summary || null,
          improvements: ai.improvements || [],
        });
      })
      .catch(() => {
        if (!cancelled) setBundle(client);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [resumeInfo, resumeId, enabled, isSignedIn]);

  return { bundle, loading };
}
