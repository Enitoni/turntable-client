import { useLoaderData } from "@remix-run/react"
import { Effect } from "effect"
import { RoomHero } from "../features/room/RoomHero"
import { getAuthorizedTurntableApi, resolveApiResponse } from "../lib/api.server"
import { effectLoader, getParams } from "../lib/data"

export const loader = effectLoader(
	Effect.gen(function* () {
		const api = yield* getAuthorizedTurntableApi()
		const params = yield* getParams()
		const room = yield* resolveApiResponse(api.rooms.room(params.slug as string))

		return yield* Effect.succeed({ room })
	}),
)

export default function Index() {
	const { room } = useLoaderData<typeof loader>()

	return (
		<div>
			<div className="mb-6">
				<h1 className="title">{room.title}</h1>
				<span className="text-base">{room.description}</span>
			</div>
			<RoomHero player={room.player} members={room.members} />
		</div>
	)
}
