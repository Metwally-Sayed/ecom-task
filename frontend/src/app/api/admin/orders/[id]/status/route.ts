import { NextResponse } from "next/server";

import { updateOrderStatus } from "@/lib/backend/orders";
import { BackendRequestError } from "@/lib/backend/client";
import { requireAdminProfile, getAccessToken } from "@/lib/auth/session";
import { orderStatusSchema } from "@/lib/schemas/order";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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
    const payload = orderStatusSchema.parse(await request.json());
    const { id } = await params;
    const response = await updateOrderStatus(id, payload.status, accessToken);
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof BackendRequestError) {
      return NextResponse.json(
        { error: error.error, message: error.message },
        { status: error.statusCode },
      );
    }

    return NextResponse.json(
      { error: "Bad Request", message: "Invalid order status payload" },
      { status: 400 },
    );
  }
}
