import { Outlet, useLoaderData } from "@remix-run/react"
import { Effect } from "effect"
import { AppHeader } from "../components/AppHeader.tsx"
import { RealtimeProvider } from "../features/realtime/RealtimeProvider.tsx"
import { baseUrl, getAuthorizedTurntableApi } from "../lib/api.server.ts"
import { effectLoader, redirect } from "../lib/data.server.ts"

export const loader = effectLoader(
	getAuthorizedTurntableApi().pipe(
		Effect.map((api) => ({ user: api.user, baseUrl: baseUrl })),
		Effect.catchTags({
			TokenNotFoundError: () => redirect("/login"),
			InvalidTokenError: () => redirect("/login"),
		}),
	),
)

export default function Index() {
	const { user, baseUrl } = useLoaderData<typeof loader>()

	return (
		<RealtimeProvider baseUrl={baseUrl}>
			<div>
				<AppHeader user={user} />
				<main className="max-w-[1100px] min-h-[calc(100vh-128px)] mx-auto mt-16 px-4 flex flex-col">
					<Outlet />
				</main>
			</div>
		</RealtimeProvider>
	)
}
