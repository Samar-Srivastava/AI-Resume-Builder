import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateAiText } from './ai.js';

const EMBEDDING_MODEL = process.env.GEMINI_EMBEDDING_MODEL || 'text-embedding-004';

let genAI;

function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) throw new Error('GOOGLE_AI_API_KEY is not configured');
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

function cosineSimilarity(a, b) {
  if (!a?.length || !b?.length || a.length !== b.length) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom ? dot / denom : 0;
}

async function embedText(text) {
  const trimmed = text.slice(0, 12000);
  const model = getGenAI().getGenerativeModel({ model: EMBEDDING_MODEL });
  const result = await model.embedContent(trimmed);
  return result.embedding?.values ?? [];
}

export async function computeSemanticMatchScore(resumeText, jobDescription) {
  if (!jobDescription?.trim() || !resumeText?.trim()) return null;

  try {
    const [resumeEmb, jdEmb] = await Promise.all([
      embedText(resumeText),
      embedText(jobDescription),
    ]);
    const sim = cosineSimilarity(resumeEmb, jdEmb);
    return Math.min(100, Math.max(0, Math.round(sim * 100)));
  } catch (err) {
    console.warn('[semantic-match]', err.message);
    return null;
  }
}

function resumeToPromptText(resume) {
  return JSON.stringify(
    {
      name: `${resume.firstName || ''} ${resume.lastName || ''}`.trim(),
      jobTitle: resume.jobTitle,
      summary: resume.summery,
      experience: (resume.Experience || []).map((e) => ({
        title: e.title,
        company: e.companyName,
        bullets: (e.workSummery || '').replace(/<[^>]+>/g, ' ').slice(0, 500),
      })),
      education: resume.education,
      skills: (resume.skills || []).map((s) => s.name),
      templateId: resume.templateId,
    },
    null,
    0
  ).slice(0, 6000);
}

export async function scoreResumeWithLlm(resume, jobDescription = '') {
  const prompt = `You are an expert resume coach and ATS analyst. Score this resume JSON for job readiness and content quality.
${jobDescription.trim() ? `Target job description:\n${jobDescription.slice(0, 3000)}\n` : ''}
Resume data:
${resumeToPromptText(resume)}

Return ONLY valid JSON:
{
  "contentScore": <0-100, writing quality and impact of bullets>,
  "atsParseScore": <0-100, how machine-readable and well-structured>,
  "jobFitScore": <0-100, relevance to job description or stated job title; if no JD use job title fit>,
  "summary": "<one encouraging sentence>",
  "topImprovements": ["<max 3 short actionable fixes>"]
}`;

  const raw = await generateAiText(prompt, { jsonMode: true });
  const parsed = JSON.parse(raw);

  const llmScore = Math.round(
    (Number(parsed.contentScore) || 0) * 0.45 +
      (Number(parsed.atsParseScore) || 0) * 0.3 +
      (Number(parsed.jobFitScore) || 0) * 0.25
  );

  return {
    llmScore: Math.min(100, Math.max(0, llmScore)),
    contentScore: parsed.contentScore,
    atsParseScore: parsed.atsParseScore,
    jobFitScore: parsed.jobFitScore,
    summary: parsed.summary || '',
    improvements: Array.isArray(parsed.topImprovements)
      ? parsed.topImprovements.slice(0, 3)
      : [],
  };
}

export async function scoreResumeFull(resume, jobDescription = '') {
  const plainText = [
    resume.firstName,
    resume.lastName,
    resume.jobTitle,
    resume.summery,
    ...(resume.Experience || []).map((e) =>
      (e.workSummery || '').replace(/<[^>]+>/g, ' ')
    ),
    ...(resume.skills || []).map((s) => s.name),
  ]
    .filter(Boolean)
    .join('\n');

  const [semantic, llm] = await Promise.all([
    computeSemanticMatchScore(plainText, jobDescription),
    scoreResumeWithLlm(resume, jobDescription),
  ]);

  return { semantic, ...llm };
}
