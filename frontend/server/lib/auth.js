import { createClerkClient, verifyToken } from '@clerk/backend';

let clerkClient;

function getClerk() {
  if (!clerkClient) {
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      throw new Error('CLERK_SECRET_KEY is not configured on the server');
    }
    clerkClient = createClerkClient({ secretKey });
  }
  return clerkClient;
}

export function getBearerToken(req) {
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  if (!authHeader || typeof authHeader !== 'string') return null;
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
}

/** @returns {Promise<string|null>} Clerk user id (sub) */
export async function requireClerkUserId(req) {
  const token = getBearerToken(req);
  if (!token) return null;

  try {
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

/** @returns {Promise<{ userId: string, email: string|null, fullName: string|null }|null>} */
export async function getClerkUserProfile(req) {
  const userId = await requireClerkUserId(req);
  if (!userId) return null;

  const clerk = getClerk();
  const user = await clerk.users.getUser(userId);
  const primaryEmail = user.emailAddresses?.find(
    (e) => e.id === user.primaryEmailAddressId
  )?.emailAddress;

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || null;

  return {
    userId,
    email: primaryEmail ?? null,
    fullName,
  };
}
