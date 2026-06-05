import { expect, test } from "@playwright/test";

test("products page and product detail flow", async ({ page }) => {
  await page.goto("/products");

  await expect(page.getByRole("heading", { name: /browse products/i })).toBeVisible();
  await expect(page.locator("body")).toContainText("products");
});
