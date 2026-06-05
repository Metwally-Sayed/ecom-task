import { NextResponse } from "next/server";

import { uploadProductImage } from "@/lib/backend/uploads";
import { BackendRequestError } from "@/lib/backend/client";
import { requireAdminProfile, getAccessToken } from "@/lib/auth/session";

export async function POST(request: Request) {
  const profile = await requireAdminProfile();
  const accessToken = await getAccessToken();

  if (!profile || !accessToken) {
    return NextResponse.json(
      {
        error: "Forbidden",
        message: "Admin access required",
      },
      { status: 403 },
    );
  }

  try {
    const formData = await request.formData();
    const response = await uploadProductImage(formData, accessToken);
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof BackendRequestError) {
      return NextResponse.json(
        { error: error.error, message: error.message },
        { status: error.statusCode },
      );
    }

    return NextResponse.json(
      { error: "Bad Request", message: "Unable to upload image" },
      { status: 400 },
    );
  }
}
