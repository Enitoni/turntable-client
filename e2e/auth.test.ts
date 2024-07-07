import { expect, test } from "@playwright/test"
import { sql } from "drizzle-orm"
import { register, registerNewUser } from "./auth.ts"
import { testDb } from "./db.ts"

test.beforeEach(async ({ context }) => {
	await testDb.execute(sql`DELETE FROM users`)
	await context.clearCookies()
})

test("redirects to home when logged in", async ({ page }) => {
	await registerNewUser(page)
	await page.goto("/login")
	await expect(page).toHaveURL("/")
	await page.goto("/register")
	await expect(page).toHaveURL("/")
})

test("redirects to login when logged out", async ({ page }) => {
	await page.goto("/")
	await expect(page).toHaveURL("/login")
})

test("redirects to login when token is invalid", async ({ page }) => {
	// simulate the scenario where the token is for a user that doesn't exist
	await registerNewUser(page)
	await testDb.execute(sql`DELETE FROM users`)

	await page.goto("/")
	await expect(page).toHaveURL("/login")
})

test("register", async ({ page }) => {
	await page.goto("/register")
	await page.waitForLoadState("networkidle")
	await page.locator('input[name="username"]').fill("frieren")
	await page.locator('input[name="displayName"]').fill("frieren")
	await page.locator('input[name="password"]').fill("auralol!!!")
	await page.getByRole("button", { name: "Submit" }).click()
	await expect(page).toHaveURL("/")
})

test("login", async ({ page }) => {
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
