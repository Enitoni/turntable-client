import { createCookie } from "@remix-run/node"
import { redirect } from "@remix-run/react"
import { Effect, pipe } from "effect"

const tokenCookie = createCookie("token", {
	path: "/",
	httpOnly: true,
	sameSite: "lax",
	secure: process.env.NODE_ENV === "production",
})

export function loginResponse(token: string) {
	return pipe(
		Effect.promise(() => tokenCookie.serialize(token)),
		Effect.map((token) => redirect("/", { headers: { "Set-Cookie": token } })),
	)
}

export function logoutResponse() {
	return pipe(
		Effect.promise(() => tokenCookie.serialize(null)),
		Effect.map((cookie) => redirect("/login", { headers: { "Set-Cookie": cookie } })),
	)
}

export class TokenNotFoundError {
	readonly _tag = "TokenNotFoundError"
}

export function getToken(request: Request) {
	return pipe(
		Effect.promise(() => tokenCookie.parse(request.headers.get("Cookie"))),
		Effect.flatMap((token) =>
			typeof token === "string" ? Effect.succeed(token) : Effect.fail(new TokenNotFoundError()),
		),
	)
}
