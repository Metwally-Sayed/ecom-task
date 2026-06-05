import { expect, test } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  await context.clearCookies();
});

test("login page renders", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
});

test("customer login opens account and blocks admin pages", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel("Email").fill("customer@test.com");
  await page.getByLabel("Password").fill("Password123!");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/account$/);
  await expect(page.getByText("Profile")).toBeVisible();

  await page.goto("/admin/products");
  await expect(page).toHaveURL(/\/products$/);
});

test("admin login redirects to product management", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel("Email").fill("admin@test.com");
  await page.getByLabel("Password").fill("Password123!");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/admin\/products$/);
  await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
  await expect(page.getByRole("link", { name: "New product" })).toBeVisible();
});
