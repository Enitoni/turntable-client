import { Effect } from "effect"
import { TurntableApi } from "../../api/TurntableApi.ts"
import { ApiError, type CancelablePromise, type User } from "../../api/index.ts"
import { getToken } from "./auth.ts"

export const baseUrl = process.env.TURNTABLE_API_URL || "http://localhost:9050"

export class TurntableApiError {
	readonly _tag = "TurntableApiError"
	constructor(readonly details: ApiError) {}
}

export class InvalidTokenError {
	readonly _tag = "InvalidTokenError"
}

export class ForbiddenError {
	readonly _tag = "InvalidTokenError"
}

export interface AuthorizedTurntableApi extends TurntableApi {
	user: User
}

export function getAuthorizedTurntableApi() {
	return Effect.gen(function* () {
		const token = yield* getToken()
		const api = new TurntableApi({
			BASE: baseUrl,
			HEADERS: { Authorization: `Bearer ${token}` },
		})
		const user = yield* resolveApiResponse(api.auth.user())
		const authorizedApi: AuthorizedTurntableApi = Object.assign(api, { user })
		return authorizedApi
	}).pipe(
		Effect.catchTag("TurntableApiError", (error) => {
			if (error.details.status === 401) {
				return Effect.fail(new InvalidTokenError())
			}
			if (error.details.status === 403) {
				return Effect.fail(new ForbiddenError())
			}
			return Effect.die(error)
		}),
	)
}

export function getTurntableApi() {
	return new TurntableApi({ BASE: baseUrl })
}

export function resolveApiResponse<T>(promise: CancelablePromise<T>) {
	return Effect.tryPromise({
		try: () => promise,
		catch: (error) => {
			if (error instanceof ApiError) {
				return new TurntableApiError(error)
			}
			throw error
		},
	})
}
