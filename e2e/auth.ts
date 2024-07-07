import { type Page, expect } from "@playwright/test"
import { TurntableApi } from "../api/TurntableApi.ts"

export async function register(username: string, password: string) {
	await new TurntableApi({ BASE: "http://localhost:9050" }).auth.register({
		username,
		displayName: username,
		password,
	})
}

export async function registerNewUser(page: Page) {
	const username = "frieren"
	const password = "auralol!!!"
	const response = await page.request.post("/register", {
		form: { username, displayName: username, password },
	})
	expect(response.status(), "failed to register user").toBe(200)
}
