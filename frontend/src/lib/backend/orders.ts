import "server-only";

import type {
  ListResponse,
  Order,
  OrderStatus,
  SingleResponse,
} from "@/lib/types";

import { backendFetch } from "./client";

export type CreateOrderInput = {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
};

export async function createOrder(
  input: CreateOrderInput,
  accessToken: string,
) {
  return backendFetch<SingleResponse<Order>>("/orders", {
    method: "POST",
    accessToken,
    body: input,
  });
}

export async function getMyOrders(
  accessToken: string,
  page = 1,
  limit = 10,
) {
  return backendFetch<ListResponse<Order>>("/orders/my", {
    accessToken,
    cache: "no-store",
    query: { page, limit },
  });
}

export async function getAllOrders(
  accessToken: string,
  params: { status?: OrderStatus; page?: number; limit?: number } = {},
) {
  return backendFetch<ListResponse<Order>>("/orders", {
    accessToken,
    cache: "no-store",
    query: {
      status: params.status,
      page: params.page ?? 1,
      limit: params.limit ?? 10,
    },
  });
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  accessToken: string,
) {
  return backendFetch<SingleResponse<Order>>(`/orders/${id}/status`, {
    method: "PATCH",
    accessToken,
    body: { status },
  });
}
