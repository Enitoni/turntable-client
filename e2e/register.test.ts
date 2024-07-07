import { expect, test } from "@playwright/test"
import { registerNewUser } from "./auth.ts"
import { describe } from "./hooks.ts"

describe("register", () => {
	test("creating account", async ({ page }) => {
		await page.goto("/register")
		await page.waitForLoadState("networkidle")
		await page.locator('input[name="username"]').fill("frieren")
		await page.locator('input[name="displayName"]').fill("frieren")
		await page.locator('input[name="password"]').fill("auralol!!!")
		await page.getByRole("button", { name: "Submit" }).click()
		await expect(page).toHaveURL("/")
	})

	test("redirects to home when logged in", async ({ page }) => {
		await registerNewUser(page)
		await page.goto("/register")
		await expect(page).toHaveURL("/")
	})
})
