import { Schema } from "@effect/schema"
import { Form, Link, redirect, useActionData } from "@remix-run/react"
import { Effect, pipe } from "effect"
import { getAuthorizedTurntableApi, getTurntableApi, resolveApiResponse } from "../lib/api.ts"
import { loginResponse } from "../lib/auth.ts"
import { effectAction, effectLoader, parseReqestBody } from "../lib/data.ts"

export const loader = effectLoader(
	pipe(
		Effect.gen(function* () {
			yield* getAuthorizedTurntableApi()
			return redirect("/")
		}),
		Effect.catchTag("TokenNotFoundError", () => Effect.succeed(null)),
	),
)

export const action = effectAction(
	Effect.gen(function* () {
		const body = yield* parseReqestBody(
			Schema.Struct({
				username: Schema.String,
				password: Schema.String,
			}),
		)
		const api = getTurntableApi()
		const response = yield* resolveApiResponse(api.auth.login(body))
		return yield* loginResponse(response.token)
	}),
)

export default function RouteComponent() {
	const data = useActionData<typeof action>()
	return (
		<Form method="post">
			<input name="username" type="text" className="bg-slate-950 border-white rounded border" />
			<input name="password" type="password" className="bg-slate-950 border-white rounded border" />
			<button type="submit">Submit</button>
			{data?.error && <div className="text-red-400">{data.error}</div>}
			<Link to="/register">Create account</Link>
		</Form>
	)
}
