import { useLoaderData } from "@remix-run/react"
import { Effect } from "effect"
import { getAuthorizedTurntableApi } from "../lib/api.ts"
import { effectLoader, redirect } from "../lib/data.ts"

export const loader = effectLoader(
	getAuthorizedTurntableApi().pipe(
		Effect.map((api) => ({ user: api.user })),
		Effect.catchTags({
			TokenNotFoundError: () => redirect("/login"),
			InvalidTokenError: () => redirect("/login"),
		}),
	),
)

export default function Index() {
	const { user } = useLoaderData<typeof loader>()
	return <div className="font-sans p-4">{JSON.stringify(user, null, 2)}</div>
}
