import { vi } from "vitest";

import { POST } from "@/app/api/auth/login/route";

const { loginMock } = vi.hoisted(() => ({
  loginMock: vi.fn(),
}));

vi.mock("@/lib/backend/auth", () => ({
  login: loginMock,
}));

describe("POST /api/auth/login", () => {
  it("sets auth cookies and only returns the user payload", async () => {
    loginMock.mockResolvedValueOnce({
      data: {
        user: {
          id: "user-1",
          email: "customer@test.com",
          name: "Customer",
          role: "customer",
          createdAt: "2026-06-05T00:00:00.000Z",
        },
        accessToken: "access-token",
        refreshToken: "refresh-token",
      },
    });

    const request = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "customer@test.com",
        password: "Password123!",
      }),
    });

    const response = await POST(request);
    const body = await response.json();
    const setCookie = response.headers.get("set-cookie") ?? "";

    expect(body).toEqual({
      data: {
        id: "user-1",
        email: "customer@test.com",
        name: "Customer",
        role: "customer",
        createdAt: "2026-06-05T00:00:00.000Z",
      },
    });
    expect(setCookie).toContain("mini_shop_access_token=");
    expect(setCookie).toContain("mini_shop_refresh_token=");
    expect(JSON.stringify(body)).not.toContain("accessToken");
    expect(JSON.stringify(body)).not.toContain("refreshToken");
  });
});
