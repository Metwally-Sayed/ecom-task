import { NextResponse } from "next/server";

import { BackendRequestError, backendFetch } from "@/lib/backend/client";
import { getSessionProfileOrThrow, getAccessToken } from "@/lib/auth/session";
import { clearAuthCookies } from "@/lib/auth/cookies";
import { updateProfileFormSchema } from "@/lib/schemas/user";

export async function PATCH(request: Request) {
  try {
    await getSessionProfileOrThrow();
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized", message: "Not authenticated" }, { status: 401 });
    }
    const payload = updateProfileFormSchema.parse(await request.json());
    const response = await backendFetch<{ message: string }>("/profile", {
      method: "PATCH",
      accessToken,
      body: payload,
    });
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof BackendRequestError) {
      return NextResponse.json({ error: error.error, message: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Bad Request", message: "Invalid payload" }, { status: 400 });
  }
}

export async function DELETE() {
  try {
    await getSessionProfileOrThrow();
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized", message: "Not authenticated" }, { status: 401 });
    }
    await backendFetch<{ message: string }>("/profile", { method: "DELETE", accessToken });
    const response = NextResponse.json({ message: "Account deleted" });
    clearAuthCookies(response.cookies);
    return response;
  } catch (error) {
    if (error instanceof BackendRequestError) {
      return NextResponse.json({ error: error.error, message: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal Server Error", message: "Failed to delete account" }, { status: 500 });
  }
}
