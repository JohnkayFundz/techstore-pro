import { test, expect } from "@playwright/test";

const emptyProducts = {
  success: true,
  products: [],
  totalProducts: 0,
  currentPage: 1,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

test.beforeEach(async ({ page }) => {
  page.on("pageerror", (error) => console.error("[browser pageerror]", error.stack || error.message));
  page.on("console", (message) => {
    if (message.type() === "error") console.error("[browser console]", message.text());
  });
  page.on("requestfailed", (request) => console.error("[browser requestfailed]", request.method(), request.url(), request.failure()?.errorText));

  // All API traffic is stubbed: no database, credentials, payment, or live service.
  await page.route("**/api/**", async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith("/settings")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          storeName: "TechStore Pro",
          currency: "USD",
          maintenanceMode: false,
        }),
      });
    }
    if (url.pathname.endsWith("/auth/me")) {
      return route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ success: false, message: "Not authenticated" }),
      });
    }
    if (url.pathname.endsWith("/products") || url.pathname.endsWith("/products/search")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(emptyProducts),
      });
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true }),
    });
  });
});

test.afterEach(async ({ page }) => {
  console.log("[browser diagnostic] URL:", page.url());
  console.log("[browser diagnostic] title:", await page.title().catch(() => "<unavailable>"));
  console.log("[browser diagnostic] body:", (await page.locator("body").innerText().catch(() => "<unavailable>")).slice(0, 1200));
});

test("storefront renders and primary navigation opens the catalogue", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /technology,/i })).toBeVisible();
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Products" }).click();
  await expect(page).toHaveURL((url) => url.pathname === "/products");
  await expect(page.getByRole("heading", { name: "TechStore Products" })).toBeVisible();
});

test("registration form validates mismatched passwords without submitting", async ({ page }) => {
  let registrationRequests = 0;
  page.on("request", (request) => {
    if (request.method() === "POST" && request.url().endsWith("/auth/register")) {
      registrationRequests += 1;
    }
  });

  await page.goto("/register");
  await page.getByLabel("Full Name").fill("QA Customer");
  await page.getByLabel("Email Address").fill("qa.customer@example.test");
  await page.getByLabel("Password", { exact: true }).fill("SecurePass123!");
  await page.getByLabel("Confirm Password").fill("DifferentPass123!");
  await page.getByRole("button", { name: "Create Account" }).click();

  await expect(page.getByRole("alert")).toContainText("Passwords do not match.");
  expect(registrationRequests).toBe(0);
});

test("empty cart offers a route back to shopping", async ({ page }) => {
  await page.goto("/cart");
  await expect(page.getByRole("heading", { name: /shopping cart/i })).toBeVisible();
  await page.getByRole("link", { name: "Continue Shopping" }).click();
  await expect(page).toHaveURL((url) => url.pathname === "/products");
  await expect(page.getByRole("heading", { name: "TechStore Products" })).toBeVisible();
});

test("protected checkout redirects a guest to sign in", async ({ page }) => {
  await page.goto("/checkout");
  await expect(page).toHaveURL((url) => url.pathname === "/login");
  await expect(page.getByRole("heading", { name: "Welcome Back" })).toBeVisible();
});
