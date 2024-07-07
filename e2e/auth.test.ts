import { test } from "@playwright/test"
import { sql } from "drizzle-orm"
import { register, registerNewUser } from "./auth.ts"
import { testDb } from "./db.ts"

test.beforeEach(async () => {
	await testDb.execute(sql`DELETE FROM users`)
})

test("redirects to home when logged in", async ({ page }) => {
	await registerNewUser(page)
	await page.goto("/login")
	await page.waitForURL("/", { timeout: 5000 })
	await page.goto("/register")
	await page.waitForURL("/", { timeout: 5000 })
})

test("redirects to login when logged out", async ({ page }) => {
	await page.goto("/")
	await page.waitForURL("/login")
})

test("register", async ({ page }) => {
	await page.goto("/register")
	await page.locator('input[name="username"]').fill("frieren")
	await page.locator('input[name="displayName"]').fill("auroralol!!!")
	await page.locator('input[name="password"]').fill("auroralol!!!")
	await page.getByRole("button", { name: "Submit" }).click()
	await page.waitForURL("/", { timeout: 5000 })
})

test("login", async ({ page }) => {
	const username = "frieren"
	const password = "auralol!!!"

	await register(username, password)

	await page.goto("/login")
	await page.locator('input[name="username"]').fill(username)
	await page.locator('input[name="password"]').fill(password)
	await page.getByRole("button", { name: "Submit" }).click()
	await page.waitForURL("/", { timeout: 5000 })
})
