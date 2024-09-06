import { json } from "@remix-run/node"
import { Effect } from "effect"
import { getAuthorizedTurntableApi } from "../lib/api.server"
import { effectAction, getRequest } from "../lib/data"

export const action = effectAction(
	Effect.gen(function* () {
		const request = yield* getRequest()
		const api = yield* getAuthorizedTurntableApi()
		const body = yield* Effect.promise(() => request.json())

		yield* Effect.promise(() => api.rooms.performRoomAction(body.roomId, { action: body.action }))

		return yield* Effect.succeed(json({}))
	}),
)
