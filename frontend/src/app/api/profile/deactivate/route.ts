import { NextResponse } from "next/server";

import { BackendRequestError, backendFetch } from "@/lib/backend/client";
import { getSessionProfileOrThrow, getAccessToken } from "@/lib/auth/session";
import { clearAuthCookies } from "@/lib/auth/cookies";

export async function POST() {
  try {
    await getSessionProfileOrThrow();
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized", message: "Not authenticated" }, { status: 401 });
    }
    await backendFetch<{ message: string }>("/profile/deactivate", { method: "POST", accessToken });
    const response = NextResponse.json({ message: "Account deactivated" });
    clearAuthCookies(response.cookies);
    return response;
  } catch (error) {
    if (error instanceof BackendRequestError) {
      return NextResponse.json({ error: error.error, message: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal Server Error", message: "Failed to deactivate account" }, { status: 500 });
  }
}
