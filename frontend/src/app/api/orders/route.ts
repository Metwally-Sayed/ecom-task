import { NextResponse } from "next/server";

import { getAccessToken } from "@/lib/auth/session";
import { createOrder } from "@/lib/backend/orders";
import { BackendRequestError } from "@/lib/backend/client";
import { createOrderSchema } from "@/lib/schemas/order";

export async function POST(request: Request) {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "Authentication required",
      },
      { status: 401 },
    );
  }

  try {
    const payload = createOrderSchema.parse(await request.json());
    const response = await createOrder(payload, accessToken);
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
        message: "Invalid order payload",
      },
      { status: 400 },
    );
  }
}
