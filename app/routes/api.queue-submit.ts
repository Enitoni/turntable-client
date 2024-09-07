import { json } from "@remix-run/node"
import { Effect } from "effect"
import { getAuthorizedTurntableApi, resolveApiResponse } from "../lib/api.server"
import { effectAction, getRequest } from "../lib/data"

export const action = effectAction(
	Effect.gen(function* () {
		const request = yield* getRequest()
		const api = yield* getAuthorizedTurntableApi()

		const body = yield* Effect.promise(() => request.json())
		const { roomId, url } = body

		yield* resolveApiResponse(api.rooms.addToQueue(roomId, { query: [url] }))

		return yield* Effect.succeed(json({}))
	}),
)
