import "server-only";

import type { SingleResponse } from "@/lib/types";

import { backendFetch } from "./client";

export async function uploadProductImage(
  formData: FormData,
  accessToken: string,
) {
  return backendFetch<SingleResponse<{ imageUrl: string }>>(
    "/uploads/product-image",
    {
      method: "POST",
      accessToken,
      body: formData,
    },
  );
}
