const STOP_WORDS = new Set([
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her',
  'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its',
  'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'she',
  'use', 'her', 'that', 'with', 'this', 'from', 'they', 'will', 'been', 'have',
  'were', 'said', 'each', 'which', 'their', 'time', 'very', 'when', 'come', 'made',
  'find', 'work', 'role', 'team', 'job', 'able', 'using', 'used', 'also', 'than',
  'other', 'into', 'only', 'over', 'such', 'your', 'must', 'should', 'would',
]);

function stripHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function extractJobKeywords(jobDescription, max = 25) {
  if (!jobDescription?.trim()) return [];

  const words = jobDescription
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/gi, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));

  const freq = {};
  words.forEach((w) => {
    freq[w] = (freq[w] || 0) + 1;
  });

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([word]) => word);
}

function buildResumeText(resumeInfo) {
  if (!resumeInfo) return '';
  const parts = [
    resumeInfo.firstName,
    resumeInfo.lastName,
    resumeInfo.jobTitle,
    resumeInfo.summery,
    resumeInfo.email,
    resumeInfo.phone,
    ...(resumeInfo.Experience || []).flatMap((e) => [
      e.title,
      e.companyName,
      stripHtml(e.workSummery),
    ]),
    ...(resumeInfo.education || []).flatMap((e) => [
      e.universityName,
      e.degree,
      e.major,
      e.description,
    ]),
    ...(resumeInfo.skills || []).map((s) => s.name),
  ];
  return parts.filter(Boolean).join(' ').toLowerCase();
}

/**
 * @returns {{ score: number, checks: Array<{ id: string, label: string, pass: boolean, tip?: string, points: number, earned: number }>, keywordMatch?: { matched: string[], missing: string[], percent: number } }}
 */
export function computeAtsScore(resumeInfo, jobDescription = '') {
  const checks = [];
  let totalPoints = 0;
  let earnedPoints = 0;

  const add = (id, label, pass, points, tip) => {
    totalPoints += points;
    if (pass) earnedPoints += points;
    checks.push({ id, label, pass, points, earned: pass ? points : 0, tip });
  };

  add(
    'name',
    'Full name on resume',
    !!(resumeInfo?.firstName?.trim() && resumeInfo?.lastName?.trim()),
    8,
    'Add first and last name in Personal Details.'
  );
  add(
    'jobTitle',
    'Target job title',
    !!resumeInfo?.jobTitle?.trim(),
    8,
    'Add the role you are applying for.'
  );
  add('email', 'Email listed', !!resumeInfo?.email?.trim(), 6);
  add('phone', 'Phone listed', !!resumeInfo?.phone?.trim(), 6);
  add(
    'summary',
    'Summary (40+ characters)',
    (resumeInfo?.summery?.trim()?.length || 0) >= 40,
    12,
    'Write a short professional summary.'
  );

  const validExp =
    resumeInfo?.Experience?.filter(
      (e) => e?.title?.trim() && e?.companyName?.trim()
    )?.length || 0;
  add(
    'experience',
    'At least one job entry',
    validExp >= 1,
    14,
    'Add work experience with company and title.'
  );
  add(
    'expContent',
    'Experience includes bullet text',
    resumeInfo?.Experience?.some((e) => stripHtml(e?.workSummery).length > 30),
    10,
    'Add bullet points under each role.'
  );

  const eduCount =
    resumeInfo?.education?.filter((e) => e?.universityName?.trim())?.length || 0;
  add('education', 'Education section', eduCount >= 1, 10);

  const skillCount =
    resumeInfo?.skills?.filter((s) => s?.name?.trim())?.length || 0;
  add(
    'skills',
    'At least 5 skills',
    skillCount >= 5,
    12,
    'List skills relevant to the job posting.'
  );

  const isMinimal = resumeInfo?.templateId === 'minimal';
  add(
    'template',
    'Using ATS-friendly Minimal template',
    isMinimal,
    14,
    'Switch to the Minimal template in the editor toolbar.'
  );

  let keywordMatch;
  const keywords = extractJobKeywords(jobDescription);
  if (keywords.length > 0) {
    const resumeText = buildResumeText(resumeInfo);
    const matched = keywords.filter((k) => resumeText.includes(k));
    const missing = keywords.filter((k) => !resumeText.includes(k));
    const percent = Math.round((matched.length / keywords.length) * 100);

    keywordMatch = { matched, missing, percent, total: keywords.length };

    add(
      'keywords',
      `Job keywords matched (${matched.length}/${keywords.length})`,
      percent >= 50,
      16,
      'Paste a job description and align your summary, skills, and bullets.'
    );
  }

  const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

  return { score, checks, keywordMatch, isMinimal };
}

export function getScoreLabel(score) {
  if (score >= 85) return { text: 'Strong', color: 'text-emerald-400' };
  if (score >= 65) return { text: 'Good', color: 'text-cyan-400' };
  if (score >= 45) return { text: 'Needs work', color: 'text-amber-400' };
  return { text: 'Getting started', color: 'text-red-400' };
}
