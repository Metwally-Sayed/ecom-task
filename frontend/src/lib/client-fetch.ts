"use client";

async function logout() {
  await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
  window.location.href = "/login";
}

export async function clientFetch(
  url: string,
  options?: RequestInit,
): Promise<Response> {
  const res = await fetch(url, options);
  if (res.status === 401) {
    await logout();
    return res;
  }
  return res;
}
