import { NextResponse } from "next/server";

import { createProduct } from "@/lib/backend/products";
import { BackendRequestError } from "@/lib/backend/client";
import { requireAdminProfile, getAccessToken } from "@/lib/auth/session";
import { productFormSchema } from "@/lib/schemas/product";

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
    const payload = productFormSchema.parse(await request.json());
    const response = await createProduct(
      {
        name: payload.name,
        description: payload.description,
        price: payload.price,
        imageUrl: payload.imageUrl || undefined,
        categoryId: payload.categoryId,
      },
      accessToken,
    );

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof BackendRequestError) {
      return NextResponse.json(
        { error: error.error, message: error.message },
        { status: error.statusCode },
      );
    }

    return NextResponse.json(
      { error: "Bad Request", message: "Invalid product payload" },
      { status: 400 },
    );
  }
}
