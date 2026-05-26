import { handleRequest } from '../server/handleRequest.js';

export default async function handler(req, res) {
  await handleRequest(req, res);
}
