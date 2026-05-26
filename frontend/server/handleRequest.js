import { getClerkUserProfile, requireClerkUserId } from './lib/auth.js';
import { generateAiText } from './lib/ai.js';
import { scoreResumeFull } from './lib/resumeScoring.js';
import { sanitizeResumePayload } from './lib/sanitize.js';
import {
  findResumeByResumeId,
  listResumesForUser,
  resumeBelongsToUser,
  strapiRequest,
  toResumeAttributes,
} from './lib/strapi.js';

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function parsePath(req) {
  const url = new URL(req.url || '/', 'http://localhost');
  const segments = url.pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean);
  return { segments, url };
}

export async function handleRequest(req, res) {
  const method = (req.method || 'GET').toUpperCase();
  const { segments } = parsePath(req);

  try {
    // POST /api/ai/generate
    if (segments[0] === 'ai' && segments[1] === 'generate' && method === 'POST') {
      const userId = await requireClerkUserId(req);
      if (!userId) {
        sendJson(res, 401, { error: 'Unauthorized' });
        return;
      }

      const body = await readJsonBody(req);
      const { prompt, jsonMode = true } = body;
      if (!prompt || typeof prompt !== 'string') {
        sendJson(res, 400, { error: 'prompt is required' });
        return;
      }

      const text = await generateAiText(prompt, { jsonMode });
      sendJson(res, 200, { text });
      return;
    }

    // POST /api/ai/score-resume — LLM + semantic JD match (auth required)
    if (segments[0] === 'ai' && segments[1] === 'score-resume' && method === 'POST') {
      const userId = await requireClerkUserId(req);
      if (!userId) {
        sendJson(res, 401, { error: 'Unauthorized' });
        return;
      }

      const body = await readJsonBody(req);
      const { resume, jobDescription = '' } = body;
      if (!resume || typeof resume !== 'object') {
        sendJson(res, 400, { error: 'resume object is required' });
        return;
      }

      const result = await scoreResumeFull(resume, jobDescription);
      sendJson(res, 200, result);
      return;
    }

    // GET /api/resumes/public/:resumeId
    if (
      segments[0] === 'resumes' &&
      segments[1] === 'public' &&
      segments[2] &&
      method === 'GET'
    ) {
      const resumeId = segments[2];
      const entry = await findResumeByResumeId(resumeId);
      if (!entry) {
        sendJson(res, 404, { error: 'Resume not found' });
        return;
      }
      const attrs = toResumeAttributes(entry);
      if (!attrs?.isPublic) {
        sendJson(res, 403, { error: 'This resume is not publicly shared' });
        return;
      }
      sendJson(res, 200, { data: attrs });
      return;
    }

    // Authenticated resume routes
    if (segments[0] === 'resumes') {
      const profile = await getClerkUserProfile(req);
      if (!profile) {
        sendJson(res, 401, { error: 'Unauthorized' });
        return;
      }

      const { userId, email, fullName } = profile;

      // GET /api/resumes
      if (segments.length === 1 && method === 'GET') {
        const list = await listResumesForUser(userId, email);
        sendJson(res, 200, { data: list });
        return;
      }

      // POST /api/resumes
      if (segments.length === 1 && method === 'POST') {
        const body = await readJsonBody(req);
        const payload = sanitizeResumePayload(body?.data ?? {});
        const createData = {
          ...payload,
          clerkUserId: userId,
          userEmail: email ?? payload.userEmail,
          userName: fullName ?? payload.userName,
          isPublic: payload.isPublic ?? false,
          templateId: payload.templateId || 'classic',
          themeColor: payload.themeColor || '#6366f1',
          publishedAt: new Date().toISOString(),
        };

        const created = await strapiRequest('/user-resumes', {
          method: 'POST',
          body: JSON.stringify({ data: createData }),
        });
        sendJson(res, 200, created);
        return;
      }

      const resumeId = segments[1];
      if (!resumeId) {
        sendJson(res, 404, { error: 'Not found' });
        return;
      }

      const entry = await findResumeByResumeId(resumeId);
      if (!entry) {
        sendJson(res, 404, { error: 'Resume not found' });
        return;
      }

      if (!resumeBelongsToUser(entry, userId, email)) {
        sendJson(res, 403, { error: 'Forbidden' });
        return;
      }

      const internalId = entry.id;

      // GET /api/resumes/:resumeId
      if (method === 'GET') {
        sendJson(res, 200, {
          data: {
            id: entry.id,
            attributes: toResumeAttributes(entry),
          },
        });
        return;
      }

      // PUT /api/resumes/:resumeId
      if (method === 'PUT') {
        const body = await readJsonBody(req);
        const payload = sanitizeResumePayload(body?.data ?? {});
        const updateData = {
          ...payload,
          clerkUserId: userId,
        };
        if (email) updateData.userEmail = email;

        const updated = await strapiRequest(`/user-resumes/${internalId}`, {
          method: 'PUT',
          body: JSON.stringify({ data: updateData }),
        });
        sendJson(res, 200, updated);
        return;
      }

      // DELETE /api/resumes/:resumeId
      if (method === 'DELETE') {
        const deleted = await strapiRequest(`/user-resumes/${internalId}`, {
          method: 'DELETE',
        });
        sendJson(res, 200, deleted);
        return;
      }
    }

    sendJson(res, 404, { error: 'Not found' });
  } catch (err) {
    console.error('[api]', err);
    const status = err.status || 500;
    sendJson(res, status, {
      error: err.message || 'Internal server error',
      details: err.data,
    });
  }
}
