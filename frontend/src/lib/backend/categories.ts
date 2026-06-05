import "server-only";

import type { Category, ListResponse } from "@/lib/types";

import { backendFetch } from "./client";

export async function getCategories() {
  return backendFetch<ListResponse<Category>>("/categories", {
    next: { tags: ["categories"] },
  });
}
