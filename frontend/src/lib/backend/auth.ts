import "server-only";

import type {
  AuthPayload,
  MessageResponse,
  Profile,
  SingleResponse,
} from "@/lib/types";

import { backendFetch } from "./client";

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export async function register(input: RegisterInput) {
  return backendFetch<SingleResponse<AuthPayload>>("/auth/register", {
    method: "POST",
    body: input,
  });
}

export async function login(input: LoginInput) {
  return backendFetch<SingleResponse<AuthPayload>>("/auth/login", {
    method: "POST",
    body: input,
  });
}

export async function forgotPassword(email: string) {
  return backendFetch<MessageResponse>("/auth/forgot-password", {
    method: "POST",
    body: { email },
  });
}

export async function getMe(accessToken: string) {
  return backendFetch<SingleResponse<Profile>>("/auth/me", {
    accessToken,
    cache: "no-store",
  });
}
