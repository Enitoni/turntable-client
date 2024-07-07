import { redirect, useLoaderData } from "@remix-run/react"
import { Effect, pipe } from "effect"
import { getAuthorizedTurntableApi } from "../lib/api.ts"
import { effectLoader } from "../lib/data.ts"

export const loader = effectLoader(
	pipe(
		Effect.gen(function* () {
			const api = yield* getAuthorizedTurntableApi()
			const user = yield* Effect.promise(() => api.auth.user())
			return { user }
		}),
		Effect.catchTag("TokenNotFoundError", () => Effect.succeed(redirect("/login"))),
	),
)

export default function Index() {
	const { user } = useLoaderData<typeof loader>()
	return <div className="font-sans p-4">{JSON.stringify(user, null, 2)}</div>
}
