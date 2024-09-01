import { createCookie } from "@remix-run/node"
import { Effect } from "effect"
import { getRequest } from "./data.ts"

const tokenCookie = createCookie("token", {
	path: "/",
	httpOnly: true,
	sameSite: "lax",
	secure: process.env.NODE_ENV === "production",
})

export class TokenNotFoundError {
	readonly _tag = "TokenNotFoundError"
}

export function getToken() {
	return getRequest().pipe(
		Effect.flatMap((request) =>
			Effect.promise(() => tokenCookie.parse(request.headers.get("Cookie"))),
		),
		Effect.filterOrFail(
			(token) => typeof token === "string",
			() => new TokenNotFoundError(),
		),
	)
}

export function getCookieToken(token: string | null) {
	return Effect.gen(function* () {
		const cookie = yield* Effect.promise(() => tokenCookie.serialize(token))
		return cookie
	})
}
