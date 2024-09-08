import { json, unstable_data } from "@remix-run/node"
import { Effect } from "effect"
import { getAuthorizedTurntableApi, resolveApiResponse } from "../lib/api.server"
import { effectAction, getRequest } from "../lib/data.server"

export const action = effectAction(
	Effect.gen(function* () {
		const request = yield* getRequest()
		const api = yield* getAuthorizedTurntableApi()

		const body = yield* Effect.promise(() => request.json())
		const { roomId, url } = body

		return yield* resolveApiResponse(api.rooms.addToQueue(roomId, { query: [url] })).pipe(
			Effect.matchEffect({
				onSuccess: () => Effect.succeed(unstable_data({}, { status: 200 })),
				onFailure: (error) => {
					return Effect.succeed(
						json({ message: error.details.body }, { status: error.details.status }),
					)
				},
			}),
		)
	}),
)
