import { Outlet, useLoaderData } from "@remix-run/react"
import { Effect } from "effect"
import { AppHeader } from "../components/AppHeader.tsx"
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

	return (
		<div>
			<AppHeader user={user} />
			<main className="max-w-[960px] mx-auto mt-16">
				<Outlet />
			</main>
		</div>
	)
}
