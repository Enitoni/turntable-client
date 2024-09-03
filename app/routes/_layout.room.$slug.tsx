import { useLoaderData } from "@remix-run/react"
import { Effect } from "effect"
import { RoomHero } from "../features/room/RoomHero"
import { RoomMemberList } from "../features/room/RoomMemberList"
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
				<span className="text-base mt-[-0.2rem] block">{room.description}</span>
			</div>
			<RoomHero room={room} player={room.player} />
			<div className="flex mt-8">
				<div className="flex-1" />
				<div className="flex-1 max-w-[330px]">
					<h4 className="mb-4 font-bold font-display">In this room</h4>
					<RoomMemberList room={room} />
				</div>
			</div>
		</div>
	)
}
