import { useLoaderData } from "@remix-run/react"
import { Effect } from "effect"
import { RoomListItem } from "../features/room/RoomListItem"
import { getAuthorizedTurntableApi, resolveApiResponse } from "../lib/api"
import { effectLoader } from "../lib/data"

export const loader = effectLoader(
	Effect.gen(function* () {
		const api = yield* getAuthorizedTurntableApi()
		const rooms = yield* resolveApiResponse(api.rooms.listRooms())

		return yield* Effect.succeed({ rooms })
	}),
)

export default function Index() {
	const { rooms } = useLoaderData<typeof loader>()

	return (
		<div>
			<h1 className="mb-4 title">Rooms</h1>
			<div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(24rem,1fr))]">
				{rooms.map((room) => (
					<RoomListItem key={room.id} room={room} />
				))}
			</div>
		</div>
	)
}
