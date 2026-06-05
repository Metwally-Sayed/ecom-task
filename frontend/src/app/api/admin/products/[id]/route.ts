import { NextResponse } from "next/server";

import { updateProduct, deleteProduct } from "@/lib/backend/products";
import { BackendRequestError } from "@/lib/backend/client";
import { requireAdminProfile, getAccessToken } from "@/lib/auth/session";
import { productFormSchema } from "@/lib/schemas/product";

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
    const payload = productFormSchema.parse(await request.json());
    const { id } = await params;
    const response = await updateProduct(
      id,
      {
        name: payload.name,
        description: payload.description,
        price: payload.price,
        imageUrl: payload.imageUrl || null,
        categoryId: payload.categoryId,
        isActive: payload.isActive,
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const profile = await requireAdminProfile();
  const accessToken = await getAccessToken();

  if (!profile || !accessToken) {
    return NextResponse.json({ error: "Forbidden", message: "Admin access required" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const response = await deleteProduct(id, accessToken);
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof BackendRequestError) {
      return NextResponse.json({ error: error.error, message: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal Server Error", message: "Failed to delete product" }, { status: 500 });
  }
}
