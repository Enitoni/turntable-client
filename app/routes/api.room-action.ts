import { json } from "@remix-run/node"
import { Effect } from "effect"
import { getAuthorizedTurntableApi } from "../lib/api.server"
import { effectAction, getRequest } from "../lib/data.server"

export const action = effectAction(
	Effect.gen(function* () {
		const request = yield* getRequest()
		const api = yield* getAuthorizedTurntableApi()

		const body = yield* Effect.promise(() => request.json())
		const { roomId, ...rest } = body

		yield* Effect.promise(() => api.rooms.performRoomAction(roomId, rest))

		return yield* Effect.succeed(json({}))
	}),
)
