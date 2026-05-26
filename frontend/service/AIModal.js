import axios from 'axios';
import { setAuthTokenGetter } from './GlobalApi';

let getAuthToken = null;

export function setAiAuthTokenGetter(getter) {
  getAuthToken = getter;
  setAuthTokenGetter(getter);
}

/**
 * Generate text via server-side Gemini proxy (API key never exposed to browser).
 * @param {string} prompt
 * @param {{ jsonMode?: boolean }} options
 * @returns {Promise<string>}
 */
export async function generateWithAI(prompt, { jsonMode = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (getAuthToken) {
    const token = await getAuthToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const { data } = await axios.post(
    '/api/ai/generate',
    { prompt, jsonMode },
    { headers }
  );

  return data.text;
}

/** LLM + embedding-based content scoring (requires sign-in) */
export async function scoreResumeWithAI(resume, jobDescription = '') {
  const headers = { 'Content-Type': 'application/json' };
  if (getAuthToken) {
    const token = await getAuthToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const { data } = await axios.post(
    '/api/ai/score-resume',
    { resume, jobDescription },
    { headers }
  );

  return data;
}
