import "server-only";

import type {
  ListResponse,
  Product,
  SingleResponse,
} from "@/lib/types";

import { backendFetch } from "./client";

export type ProductStatusFilter = "all" | "active" | "inactive";

export type ProductListParams = {
  search?: string;
  category?: string;
  status?: ProductStatusFilter;
  page?: number;
  limit?: number;
};

export type CreateProductInput = {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId: string;
};

export type UpdateProductInput = {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string | null;
  categoryId?: string;
  isActive?: boolean;
};

export async function getProducts(params: ProductListParams = {}) {
  return backendFetch<ListResponse<Product>>("/products", {
    query: {
      search: params.search,
      category: params.category,
      status: params.status ?? "active",
      page: params.page ?? 1,
      limit: params.limit ?? 12,
    },
    next: { tags: ["products"] },
  });
}

export async function getProduct(id: string) {
  return backendFetch<SingleResponse<Product>>(`/products/${id}`, {
    next: { tags: ["products", `product:${id}`] },
  });
}

export async function createProduct(
  input: CreateProductInput,
  accessToken: string,
) {
  return backendFetch<SingleResponse<Product>>("/products", {
    method: "POST",
    accessToken,
    body: input,
  });
}

export async function updateProduct(
  id: string,
  input: UpdateProductInput,
  accessToken: string,
) {
  return backendFetch<SingleResponse<Product>>(`/products/${id}`, {
    method: "PATCH",
    accessToken,
    body: input,
  });
}

export async function deleteProduct(id: string, accessToken: string) {
  return backendFetch<{ message: string }>(`/products/${id}`, {
    method: "DELETE",
    accessToken,
  });
}
