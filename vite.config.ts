import { vitePlugin as remix } from "@remix-run/dev"
import { remixRoutes } from "remix-routes/vite.js"
import { defineConfig } from "vite"
import { envOnlyMacros } from "vite-env-only"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
	plugins: [
		remix({
			future: {
				v3_fetcherPersist: true,
				v3_relativeSplatPath: true,
				v3_throwAbortReason: true,
				unstable_singleFetch: true,
				unstable_fogOfWar: true,
			},
		}),
		remixRoutes(),
		tsconfigPaths(),
		envOnlyMacros(),
	],
})
