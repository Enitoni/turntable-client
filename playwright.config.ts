import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
	// Look for test files in the "tests" directory, relative to this configuration file.
	testDir: "e2e",

	// Run all tests in parallel.
	fullyParallel: false,

	// Fail the build on CI if you accidentally left test.only in the source code.
	forbidOnly: !!process.env.CI,

	// Retry on CI only.
	retries: process.env.CI ? 2 : 0,

	// Opt out of parallel tests on CI.
	workers: 1,

	// Reporter to use
	reporter: "html",

	use: {
		// Base URL to use in actions like `await page.goto('/')`.
		baseURL: "http://localhost:5173",

		// Collect trace when retrying the failed test.
		trace: "on-first-retry",
	},
	// Configure projects for major browsers.
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] },
		},
	],
	// Run your local dev server before starting the tests.
	webServer: [
		// {
		// 	command: "bun run dev:db",
		// 	url: "http://0.0.0.0:5432",
		// 	reuseExistingServer: !process.env.CI,
		// 	stdout: "pipe",
		// },
		{
			command: "bun run dev:server",
			port: 9050,
			reuseExistingServer: !process.env.CI,
			stdout: "pipe",
		},
		{
			command: "bun run dev:remix",
			url: "http://localhost:5173",
			reuseExistingServer: !process.env.CI,
			stdout: "pipe",
		},
	],
})
