import { redirect, useLoaderData } from "@remix-run/react"
import { Effect, pipe } from "effect"
import { getAuthorizedTurntableApi, resolveApiResponse } from "../lib/api.ts"
import { logoutResponse } from "../lib/auth.ts"
import { effectLoader } from "../lib/data.ts"

export const loader = effectLoader(
	pipe(
		Effect.gen(function* () {
			const api = yield* getAuthorizedTurntableApi()
			const user = yield* resolveApiResponse(api.auth.user())
			return { user }
		}),
		Effect.catchTags({
			TokenNotFoundError: () => Effect.succeed(redirect("/login")),
			TurntableApiError: (error) => {
				if (error.details.status === 401) {
					return logoutResponse() // clear the invalid token
				}
				return Effect.die(error)
			},
		}),
	),
)

export default function Index() {
	const { user } = useLoaderData<typeof loader>()
	return <div className="font-sans p-4">{JSON.stringify(user, null, 2)}</div>
}
