import { Effect } from "effect"
import { getTurntableApi, resolveApiResponse } from "../../lib/api.server"
import { getRequest } from "../../lib/data.server"

export const getInviteIfSpecified = () =>
	Effect.gen(function* () {
		const request = yield* getRequest()
		const url = new URL(request.url)

		const token = url.searchParams.get("invite")

		if (!token) {
			return yield* Effect.succeed(undefined)
		}

		const api = getTurntableApi()

		const invite = yield* resolveApiResponse(api.rooms.inviteByToken(token)).pipe(
			Effect.catchTag("TurntableApiError", (error) => {
				if (error.details.status === 404) {
					return Effect.succeed(undefined)
				}

				return Effect.fail(error)
			}),
		)

		return yield* Effect.succeed(invite)
	})
