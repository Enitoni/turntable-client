import { Effect } from "effect"
import { TurntableApi } from "../../api/TurntableApi.ts"
import { ApiError, type CancelablePromise } from "../../api/index.ts"
import { getToken } from "./auth.ts"
import { getRequest } from "./data.ts"

const baseUrl = process.env.TURNTABLE_API_URL || "http://localhost:9050"

export class TurntableApiError {
	readonly _tag = "TurntableApiError"
	constructor(readonly details: ApiError) {}
}

export function getAuthorizedTurntableApi() {
	return Effect.gen(function* () {
		const request = yield* getRequest()
		const token = yield* getToken(request)
		return new TurntableApi({
			BASE: baseUrl,
			HEADERS: { Authorization: `Bearer ${token}` },
		})
	})
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
