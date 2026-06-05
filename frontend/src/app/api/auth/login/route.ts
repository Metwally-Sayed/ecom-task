import { NextResponse } from "next/server";

import { login } from "@/lib/backend/auth";
import { BackendRequestError } from "@/lib/backend/client";
import { setAuthCookies } from "@/lib/auth/cookies";
import { loginSchema } from "@/lib/schemas/auth";

export async function POST(request: Request) {
  try {
    const payload = loginSchema.parse(await request.json());
    const response = await login(payload);
    const nextResponse = NextResponse.json({ data: response.data.user });

    setAuthCookies(nextResponse.cookies, response.data);

    return nextResponse;
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
        message: "Invalid login payload",
      },
      { status: 400 },
    );
  }
}
