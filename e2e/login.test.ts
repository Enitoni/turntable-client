import { expect, test } from "@playwright/test"
import { register, registerNewUser } from "./auth.ts"
import { describe } from "./hooks.ts"

describe("login", () => {
	test("logging in", async ({ page }) => {
		const username = "frieren"
		const password = "auralol!!!"

		await register(username, password)

		await page.goto("/login")
		await page.waitForLoadState("networkidle")
		await page.locator('input[name="username"]').fill(username)
		await page.locator('input[name="password"]').fill(password)
		await page.getByRole("button", { name: "Submit" }).click()
		await expect(page).toHaveURL("/")
	})

	test("redirects to home when logged in", async ({ page }) => {
		await registerNewUser(page)
		await page.goto("/login")
		await expect(page).toHaveURL("/")
	})
})
