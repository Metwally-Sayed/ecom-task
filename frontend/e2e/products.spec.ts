import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
});

test("products page supports search, filtering, details, and cart", async ({ page }) => {
  await page.goto("/products");

  await expect(page.getByRole("heading", { name: /browse our products/i })).toBeVisible();
  await expect(page.locator("body")).toContainText(/\d+ products/);

  await page.getByLabel("Search").fill("wireless");
  await expect(page).toHaveURL(/search=wireless/);
  await expect(page.locator("body")).toContainText(/Wireless/i);

  await page.getByLabel("Search").fill("");
  await expect(page).not.toHaveURL(/search=wireless/);

  await page.getByRole("combobox", { name: "Category" }).click();
  await page.getByRole("option", { name: "Electronics" }).click();
  await expect(page).toHaveURL(/category=electronics/);
  await expect(page.locator("body")).toContainText("Electronics");

  const firstProduct = page.locator('a[href^="/products/"]').first();
  await firstProduct.click();

  await expect(page).toHaveURL(/\/products\/[0-9a-f-]+/);
  await expect(page.getByText("Product details")).toBeVisible();
  await expect(page.getByRole("button", { name: "Add to cart" })).toBeVisible();

  await page.getByRole("button", { name: "Add to cart" }).click();
  await expect(page.getByRole("button", { name: /cart\s+1/i })).toBeVisible();
});
