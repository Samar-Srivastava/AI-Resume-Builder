import { GoogleGenerativeAI } from '@google/generative-ai';

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'application/json',
};

let model;

function getModel() {
  if (!model) {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY is not configured on the server');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      generationConfig,
    });
  }
  return model;
}

export async function generateAiText(prompt, { jsonMode = true } = {}) {
  const m = getModel();
  const result = await m.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: jsonMode
      ? generationConfig
      : { ...generationConfig, responseMimeType: 'text/plain' },
  });
  return result.response.text();
}
