import { test } from "@playwright/test"
import { sql } from "drizzle-orm"
import { testDb } from "./db.ts"

export function describe(name: string, callback: () => void) {
	return test.describe(name, () => {
		setup()
		callback()
	})
}

export function setup() {
	test.beforeEach(async ({ context }) => {
		await testDb.execute(sql`DELETE FROM users`)
		await context.clearCookies()
	})
}
