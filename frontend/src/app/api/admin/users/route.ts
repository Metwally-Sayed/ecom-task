import { NextResponse } from "next/server";

import { BackendRequestError } from "@/lib/backend/client";
import { getSessionProfileOrThrow } from "@/lib/auth/session";
import { getAccessToken } from "@/lib/auth/session";
import { createUserBackend } from "@/lib/backend/users";
import { createUserFormSchema } from "@/lib/schemas/user";

export async function POST(request: Request) {
  try {
    const profile = await getSessionProfileOrThrow();
    const accessToken = await getAccessToken();

    if (profile.role !== "admin" || !accessToken) {
      return NextResponse.json({ error: "Forbidden", message: "Admin access required" }, { status: 403 });
    }

    const payload = createUserFormSchema.parse(await request.json());
    const response = await createUserBackend(payload, accessToken);
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof BackendRequestError) {
      return NextResponse.json({ error: error.error, message: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Bad Request", message: "Invalid user payload" }, { status: 400 });
  }
}
