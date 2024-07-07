import { expect, test } from "@playwright/test"
import { sql } from "drizzle-orm"
import { register, registerNewUser } from "./auth.ts"
import { testDb } from "./db.ts"

test.beforeEach(async () => {
	await testDb.execute(sql`DELETE FROM users`)
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

test("register", async ({ page }) => {
	await page.goto("/register")
	await page.locator('input[name="username"]').fill("frieren")
	await page.locator('input[name="displayName"]').fill("auroralol!!!")
	await page.locator('input[name="password"]').fill("auroralol!!!")
	await page.getByRole("button", { name: "Submit" }).click()
	await expect(page).toHaveURL("/")
})

test("login", async ({ page }) => {
	const username = "frieren"
	const password = "auralol!!!"

	await register(username, password)

	await page.goto("/login")
	await page.locator('input[name="username"]').fill(username)
	await page.locator('input[name="password"]').fill(password)
	await page.getByRole("button", { name: "Submit" }).click()
	await expect(page).toHaveURL("/")
})
