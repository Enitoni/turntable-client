import { Schema } from "@effect/schema"
import { Form, Link, useActionData } from "@remix-run/react"
import { Effect } from "effect"
import { getAuthorizedTurntableApi, getTurntableApi, resolveApiResponse } from "../lib/api.ts"
import { setToken } from "../lib/auth.ts"
import { effectAction, effectLoader, parseReqestBody, redirect } from "../lib/data.ts"

export const loader = effectLoader(
	Effect.matchEffect(getAuthorizedTurntableApi(), {
		onSuccess: () => redirect("/"),
		onFailure: () => Effect.succeed(null),
	}),
)

export const action = effectAction(
	Effect.gen(function* () {
		const body = yield* parseReqestBody(
			Schema.Struct({
				username: Schema.String,
				displayName: Schema.String,
				password: Schema.String,
			}),
		)
		const api = getTurntableApi()
		yield* resolveApiResponse(api.auth.register(body))
		const response = yield* resolveApiResponse(
			api.auth.login({ username: body.username, password: body.password }),
		)
		yield* setToken(response.token)
		return yield* redirect("/")
	}),
)

export default function RouteComponent() {
	const data = useActionData<typeof action>()
	return (
		<Form method="post">
			<input name="username" type="text" className="bg-slate-950 border-white rounded border" />
			<input name="displayName" type="text" className="bg-slate-950 border-white rounded border" />
			<input name="password" type="password" className="bg-slate-950 border-white rounded border" />
			<button type="submit">Submit</button>
			{data?.error && <div className="text-red-400">{data.error}</div>}
			<Link to="/login">Sign in</Link>
		</Form>
	)
}
