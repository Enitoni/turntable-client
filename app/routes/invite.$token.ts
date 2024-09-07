import { Effect } from "effect"
import { getAuthorizedTurntableApi, resolveApiResponse } from "../lib/api.server"
import { effectLoader, getParams, redirect } from "../lib/data.server"

export const loader = effectLoader(
	Effect.matchEffect(getAuthorizedTurntableApi(), {
		onFailure: () =>
			Effect.gen(function* () {
				const params = yield* getParams()
				const token = params.token as string

				return yield* redirect(`/login?invite=${token}`)
			}),
		onSuccess: (api) =>
			Effect.gen(function* () {
				const params = yield* getParams()
				const token = params.token as string

				const invite = yield* resolveApiResponse(api.rooms.inviteByToken(token))

				yield* resolveApiResponse(
					api.rooms.joinWithInvite({
						token: invite.token,
					}),
				)

				return yield* redirect(`/room/${invite.roomSlug}`)
			}),
	}),
)
