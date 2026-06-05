import "server-only";

import type { ListResponse, Profile, SingleResponse } from "@/lib/types";
import { backendFetch } from "./client";

export type UserListParams = {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
};

export async function getUsers(params: UserListParams = {}, accessToken: string) {
  return backendFetch<ListResponse<Profile>>("/users", {
    accessToken,
    query: {
      search: params.search,
      role: params.role ?? "all",
      status: params.status ?? "all",
      page: params.page ?? 1,
      limit: params.limit ?? 10,
    },
  });
}

export async function createUserBackend(
  input: { name: string; email: string; password: string; role: string },
  accessToken: string,
) {
  return backendFetch<SingleResponse<Profile>>("/users", {
    method: "POST",
    accessToken,
    body: input,
  });
}

export async function updateUserBackend(
  id: string,
  input: { name?: string; email?: string; role?: string; status?: string },
  accessToken: string,
) {
  return backendFetch<SingleResponse<Profile>>(`/users/${id}`, {
    method: "PATCH",
    accessToken,
    body: input,
  });
}

export async function deleteUserBackend(id: string, accessToken: string) {
  return backendFetch<{ message: string }>(`/users/${id}`, {
    method: "DELETE",
    accessToken,
  });
}
