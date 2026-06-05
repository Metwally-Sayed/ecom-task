import "server-only";

import { cookies } from "next/headers";

import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/cookies";
import { getMe } from "@/lib/backend/auth";
import { BackendRequestError } from "@/lib/backend/client";

export async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
}

export async function getSessionProfile() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return null;
  }

  try {
    const response = await getMe(accessToken);
    return response.data;
  } catch (error) {
    if (
      error instanceof BackendRequestError &&
      error.statusCode === 401
    ) {
      return null;
    }

    throw error;
  }
}

export async function requireAdminProfile() {
  const profile = await getSessionProfile();

  if (!profile || profile.role !== "admin") {
    return null;
  }

  return profile;
}

/**
 * Returns the profile, or throws a BackendRequestError if the session is
 * invalid (401 from backend — deactivated/blocked/expired token).
 * Used by API route handlers that need to distinguish "no session" (401)
 * from "wrong role" (403).
 */
export async function getSessionProfileOrThrow() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new BackendRequestError({ statusCode: 401, error: "Unauthorized", message: "Not authenticated" });
  }

  const response = await getMe(accessToken);
  return response.data;
}
