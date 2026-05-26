const STRAPI_URL = () =>
  (process.env.STRAPI_API_URL || 'http://localhost:1337').replace(/\/$/, '');

function strapiHeaders() {
  const token = process.env.STRAPI_API_TOKEN;
  if (!token) {
    throw new Error('STRAPI_API_TOKEN is not configured on the server');
  }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function strapiRequest(path, options = {}) {
  const url = `${STRAPI_URL()}/api${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      ...strapiHeaders(),
      ...options.headers,
    },
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    const err = new Error(data?.error?.message || `Strapi error ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export async function findResumeByResumeId(resumeId, populate = true) {
  const populateQuery = populate ? '&populate=*' : '';
  const data = await strapiRequest(
    `/user-resumes?filters[resumeId][$eq]=${encodeURIComponent(resumeId)}${populateQuery}`
  );
  return data?.data?.[0] ?? null;
}

export async function listResumesForUser(clerkUserId, userEmail) {
  const params = new URLSearchParams();
  params.set('populate', '*');
  params.set('filters[$or][0][clerkUserId][$eq]', clerkUserId);
  if (userEmail) {
    params.set('filters[$or][1][userEmail][$eq]', userEmail);
  }
  const data = await strapiRequest(`/user-resumes?${params.toString()}`);
  return data?.data ?? [];
}

export function resumeBelongsToUser(entry, clerkUserId, userEmail) {
  const attrs = entry?.attributes ?? entry;
  if (attrs?.clerkUserId && attrs.clerkUserId === clerkUserId) return true;
  if (userEmail && attrs?.userEmail && attrs.userEmail === userEmail) return true;
  return false;
}

export function toResumeAttributes(entry) {
  if (!entry) return null;
  if (entry.attributes) return entry.attributes;
  return entry;
}
