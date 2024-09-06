import { useLoaderData } from "@remix-run/react"
import { Effect } from "effect"
import { useState } from "react"
import type { Player } from "../../api"
import { PlayerBar } from "../features/player/PlayerBar"
import { useServerEvent } from "../features/realtime/hooks"
import { QueueList } from "../features/room/QueueList"
import { RoomHero } from "../features/room/RoomHero"
import { RoomMemberList } from "../features/room/RoomMemberList"
import { getAuthorizedTurntableApi, resolveApiResponse } from "../lib/api.server"
import { effectLoader, getParams } from "../lib/data"

export const loader = effectLoader(
	Effect.gen(function* () {
		const api = yield* getAuthorizedTurntableApi()
		const params = yield* getParams()

		const room = yield* resolveApiResponse(api.rooms.room(params.slug as string))
		const queue = yield* resolveApiResponse(api.rooms.queue(room.id))

		return yield* Effect.succeed({ room, queue })
	}),
)

export default function Index() {
	const { room, queue: rawQueue } = useLoaderData<typeof loader>()
	const [queue, setQueue] = useState(rawQueue)

	useServerEvent((event) => {
		// @ts-expect-error: event type is wrong
		if (event.type === "room-queue-update" && event.room_id === room.id) {
			// @ts-expect-error: event type is wrong
			setQueue({ items: event.items, history: event.history })
		}
	})

	return (
		<div>
			<div className="mb-6">
				<h1 className="title">{room.title}</h1>
				<span className="text-base mt-[-0.2rem] block">{room.description}</span>
			</div>
			<RoomHero room={room} currentQueueItem={queue.items[0]} player={room.player} />
			<div className="flex gap-6 mt-8">
				<div className="flex-1">
					<QueueList queue={queue} />
				</div>
				<div className="flex-shrink-0 min-w-[330px]">
					<h4 className="mb-4 font-bold font-display">In this room</h4>
					<RoomMemberList room={room} />
				</div>
			</div>
			<div className="sticky bottom-8">
				<PlayerBar roomId={room.id} player={room.player as Player | undefined} />
			</div>
		</div>
	)
}
