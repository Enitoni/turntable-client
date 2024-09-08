import { useLoaderData } from "@remix-run/react"
import { Effect } from "effect"
import { useEffect, useState } from "react"
import type { Player } from "../../api"
import { STREAM_KEY_SOURCE_NAME } from "../features/core/constants"
import { AudioProvider } from "../features/player/AudioProvider"
import { NotAllowedWarning } from "../features/player/NotAllowedWarning"
import { PlayerBar } from "../features/player/PlayerBar"
import { useServerEvent } from "../features/realtime/hooks"
import { QueueList } from "../features/room/QueueList"
import { RoomHero } from "../features/room/RoomHero"
import { RoomMemberList } from "../features/room/RoomMemberList"
import { baseUrl, getAuthorizedTurntableApi, resolveApiResponse } from "../lib/api.server"
import { effectLoader, getParams } from "../lib/data.server"

const getOrCreateStreamKey = (roomId: number) =>
	Effect.gen(function* () {
		const api = yield* getAuthorizedTurntableApi()

		const streamKeys = yield* resolveApiResponse(api.rooms.streamKeys(roomId))
		const existingKey = streamKeys.find((key) => key.source === STREAM_KEY_SOURCE_NAME)

		if (existingKey) {
			return yield* Effect.succeed(existingKey)
		}

		const newKey = yield* resolveApiResponse(
			api.rooms.createStreamKey(roomId, {
				source: STREAM_KEY_SOURCE_NAME,
			}),
		)

		return yield* Effect.succeed(newKey)
	})

export const loader = effectLoader(
	Effect.gen(function* () {
		const api = yield* getAuthorizedTurntableApi()
		const params = yield* getParams()

		const initialRoom = yield* resolveApiResponse(api.rooms.room(params.slug as string))
		const queue = yield* resolveApiResponse(api.rooms.queue(initialRoom.id))

		const streamKey = yield* getOrCreateStreamKey(initialRoom.id)
		const streamUrl = `${baseUrl}/v1/streams/${streamKey.token}`

		// FIXME: A workaround to player being null before getting the queue, but existing afterwards
		const room = yield* resolveApiResponse(api.rooms.room(params.slug as string))

		return yield* Effect.succeed({ room, queue, streamUrl })
	}),
)

export default function Index() {
	const { room, queue: rawQueue, streamUrl } = useLoaderData<typeof loader>()
	const [queue, setQueue] = useState(rawQueue)

	useServerEvent((event) => {
		// @ts-expect-error: event type is wrong
		if (event.type === "room-queue-update" && event.room_id === room.id) {
			// @ts-expect-error: event type is wrong
			setQueue({ items: event.items, history: event.history })
		}
	})

	useEffect(() => {
		const queueItem = queue.items[0]

		if (queueItem) {
			document.title = `${queueItem.track.title} | ${room.title} - turntable`
		} else {
			document.title = `${room.title} - turntable`
		}
	}, [queue, room])

	return (
		<AudioProvider streamUrl={streamUrl}>
			<NotAllowedWarning />
			<div className="mb-6">
				<h1 className="title">{room.title}</h1>
				<span className="text-base mt-[-0.2rem] block">{room.description}</span>
			</div>
			<RoomHero room={room} currentQueueItem={queue.items[0]} player={room.player} />
			<div className="flex flex-1 gap-6 mt-8">
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
		</AudioProvider>
	)
}
