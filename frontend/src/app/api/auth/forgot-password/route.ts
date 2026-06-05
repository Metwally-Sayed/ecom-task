import { NextResponse } from "next/server";

import { forgotPassword } from "@/lib/backend/auth";
import { BackendRequestError } from "@/lib/backend/client";
import { forgotPasswordSchema } from "@/lib/schemas/auth";

export async function POST(request: Request) {
  try {
    const payload = forgotPasswordSchema.parse(await request.json());
    const response = await forgotPassword(payload.email);
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof BackendRequestError) {
      return NextResponse.json(
        {
          error: error.error,
          message: error.message,
        },
        { status: error.statusCode },
      );
    }

    return NextResponse.json(
      {
        error: "Bad Request",
        message: "Invalid email payload",
      },
      { status: 400 },
    );
  }
}
