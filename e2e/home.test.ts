import { expect, test } from "@playwright/test"
import { sql } from "drizzle-orm"
import { registerNewUser } from "./auth.ts"
import { testDb } from "./db.ts"
import { describe } from "./hooks.ts"

describe("home", () => {
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
})
