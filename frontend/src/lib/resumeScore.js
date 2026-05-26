import {
  computeAtsScore,
  extractJobKeywords,
  getScoreLabel,
} from './atsScore';

export { getScoreLabel };

const ACTION_VERBS =
  /\b(led|managed|built|developed|designed|implemented|improved|increased|reduced|delivered|created|launched|optimized|automated|spearheaded|coordinated|analyzed|achieved)\b/i;

const METRICS_PATTERN =
  /\d+%|\$\d|₹\d|\d+\+|\d{1,3}(,\d{3})+|\b\d+\s*(years?|yrs|months?|users?|customers?|projects?)\b/i;

function stripHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function buildResumePlainText(resumeInfo) {
  if (!resumeInfo) return '';
  const parts = [
    resumeInfo.firstName,
    resumeInfo.lastName,
    resumeInfo.jobTitle,
    resumeInfo.summery,
    ...(resumeInfo.Experience || []).flatMap((e) => [
      e.title,
      e.companyName,
      stripHtml(e.workSummery),
    ]),
    ...(resumeInfo.education || []).flatMap((e) => [
      e.universityName,
      e.degree,
      e.major,
    ]),
    ...(resumeInfo.skills || []).map((s) => s.name),
  ];
  return parts.filter(Boolean).join('\n');
}

/** Text-quality heuristics (0–100), explainable */
export function computeContentHeuristics(resumeInfo) {
  const bullets = (resumeInfo?.Experience || [])
    .map((e) => stripHtml(e?.workSummery))
    .filter((t) => t.length > 10);

  let earned = 0;
  const max = 100;
  const details = [];

  if (bullets.length > 0) {
    const withVerbs = bullets.filter((b) => ACTION_VERBS.test(b)).length;
    const verbPct = Math.round((withVerbs / bullets.length) * 100);
    const verbPass = verbPct >= 50;
    earned += verbPass ? 25 : Math.round((verbPct / 100) * 25);
    details.push({
      label: `Action verbs in bullets (${withVerbs}/${bullets.length})`,
      pass: verbPass,
    });

    const withMetrics = bullets.filter((b) => METRICS_PATTERN.test(b)).length;
    const metricPct = Math.round((withMetrics / bullets.length) * 100);
    const metricPass = withMetrics >= 1;
    earned += metricPass ? 25 : Math.round((metricPct / 100) * 15);
    details.push({
      label: `Quantified results (${withMetrics} bullets with numbers)`,
      pass: metricPass,
    });
  } else {
    details.push({ label: 'Add experience bullet points', pass: false });
  }

  const summary = resumeInfo?.summery?.trim() || '';
  const summaryOk = summary.length >= 60 && summary.length <= 600;
  earned += summaryOk ? 20 : summary.length > 0 ? 10 : 0;
  details.push({
    label: 'Summary length (60–600 chars)',
    pass: summaryOk,
  });

  const jobTitle = (resumeInfo?.jobTitle || '').toLowerCase();
  const titleInSummary =
    jobTitle.length > 2 && summary.toLowerCase().includes(jobTitle.split(' ')[0]);
  earned += titleInSummary ? 15 : 0;
  details.push({
    label: 'Summary aligns with job title',
    pass: titleInSummary,
  });

  const skillNames = (resumeInfo?.skills || [])
    .map((s) => s?.name?.toLowerCase())
    .filter(Boolean);
  const resumeLower = buildResumePlainText(resumeInfo).toLowerCase();
  const skillsInBody = skillNames.filter((s) => resumeLower.includes(s)).length;
  const skillsPass = skillNames.length >= 3 && skillsInBody >= 2;
  earned += skillsPass ? 15 : skillNames.length ? 8 : 0;
  details.push({
    label: 'Skills mentioned in experience/summary',
    pass: skillsPass,
  });

  return {
    score: Math.min(100, Math.round((earned / max) * 100)),
    details,
  };
}

export function computeKeywordScore(resumeInfo, jobDescription) {
  const keywords = extractJobKeywords(jobDescription);
  if (!keywords.length) return null;

  const resumeText = buildResumePlainText(resumeInfo).toLowerCase();
  const matched = keywords.filter((k) => resumeText.includes(k));
  const percent = Math.round((matched.length / keywords.length) * 100);

  return {
    score: percent,
    matched,
    missing: keywords.filter((k) => !resumeText.includes(k)),
    total: keywords.length,
  };
}

/**
 * Weighted overall score from sub-scores.
 */
export function combineResumeScores({
  readiness,
  heuristics,
  keyword,
  semantic,
  llm,
}) {
  const hasKeyword = keyword != null;
  const hasSemantic = semantic != null;
  const hasLlm = llm != null;

  if (hasLlm && (hasKeyword || hasSemantic)) {
    return Math.round(
      readiness * 0.18 +
        heuristics * 0.17 +
        (keyword ?? 0) * 0.15 +
        (semantic ?? keyword ?? 0) * 0.15 +
        llm * 0.35
    );
  }

  if (hasLlm) {
    return Math.round(readiness * 0.35 + heuristics * 0.25 + llm * 0.4);
  }

  if (hasKeyword || hasSemantic) {
    return Math.round(
      readiness * 0.4 +
        heuristics * 0.3 +
        ((keyword ?? 0) + (semantic ?? 0)) / (hasKeyword && hasSemantic ? 2 : 1) * 0.3
    );
  }

  return Math.round(readiness * 0.55 + heuristics * 0.45);
}

/** Client-side bundle (instant) */
export function computeClientScoreBundle(resumeInfo, jobDescription = '') {
  const readiness = computeAtsScore(resumeInfo, jobDescription);
  const heuristics = computeContentHeuristics(resumeInfo);
  const keyword = jobDescription.trim()
    ? computeKeywordScore(resumeInfo, jobDescription)
    : null;

  const overall = combineResumeScores({
    readiness: readiness.score,
    heuristics: heuristics.score,
    keyword: keyword?.score ?? null,
    semantic: null,
    llm: null,
  });

  return {
    overall,
    readiness: readiness.score,
    heuristics: heuristics.score,
    keyword: keyword?.score ?? null,
    semantic: null,
    llm: null,
    readinessChecks: readiness.checks,
    heuristicDetails: heuristics.details,
    keywordMatch: keyword,
    llmSummary: null,
    improvements: [],
  };
}

export const JD_STORAGE_KEY = (resumeId) => `resume-jd-${resumeId}`;
