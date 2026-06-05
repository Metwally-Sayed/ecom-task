import { NextResponse } from "next/server";

import { BackendRequestError } from "@/lib/backend/client";
import { getSessionProfileOrThrow, getAccessToken } from "@/lib/auth/session";
import { updateUserBackend, deleteUserBackend } from "@/lib/backend/users";
import { updateUserFormSchema } from "@/lib/schemas/user";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const profile = await getSessionProfileOrThrow();
    const accessToken = await getAccessToken();

    if (profile.role !== "admin" || !accessToken) {
      return NextResponse.json({ error: "Forbidden", message: "Admin access required" }, { status: 403 });
    }

    const { id } = await params;
    const payload = updateUserFormSchema.parse(await request.json());
    const response = await updateUserBackend(id, payload, accessToken);
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof BackendRequestError) {
      return NextResponse.json({ error: error.error, message: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Bad Request", message: "Invalid user payload" }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const profile = await getSessionProfileOrThrow();
    const accessToken = await getAccessToken();

    if (profile.role !== "admin" || !accessToken) {
      return NextResponse.json({ error: "Forbidden", message: "Admin access required" }, { status: 403 });
    }

    const { id } = await params;
    const response = await deleteUserBackend(id, accessToken);
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof BackendRequestError) {
      return NextResponse.json({ error: error.error, message: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal Server Error", message: "Failed to delete user" }, { status: 500 });
  }
}
