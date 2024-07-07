import { Schema } from "@effect/schema"
import type { ParseError } from "@effect/schema/ParseResult"
import type { LoaderFunctionArgs } from "@remix-run/node"
import type { Params } from "@remix-run/react"
import { Context, Effect, pipe } from "effect"
import type { ActionFunctionArgs } from "react-router"
import type { TurntableApiError } from "./api.ts"

class RequestService extends Context.Tag("RequestService")<RequestService, Request>() {}
class ParamsService extends Context.Tag("ParamsService")<ParamsService, Params<string>>() {}
export type { ParamsService, RequestService }

export type DataFunctionServices = RequestService | ParamsService

export function getRequest() {
	return RequestService
}

export function getParams() {
	return ParamsService
}

export function effectLoader<Output>(effect: Effect.Effect<Output, never, DataFunctionServices>) {
	return async function loader(args: LoaderFunctionArgs) {
		return pipe(
			effect,
			Effect.provideService(RequestService, args.request),
			Effect.provideService(ParamsService, args.params),
			Effect.runPromise,
		)
	}
}

export function effectAction<Output>(
	effect: Effect.Effect<Output, TurntableApiError | ParseError, DataFunctionServices>,
) {
	return async function action(args: ActionFunctionArgs) {
		return pipe(
			effect,
			Effect.provideService(RequestService, args.request),
			Effect.provideService(ParamsService, args.params),
			Effect.catchTags({
				TurntableApiError: (error) => Effect.succeed({ error: String(error.details.body) }),
				ParseError: (error) => Effect.succeed({ error: error.message }),
			}),
			Effect.runPromise,
		)
	}
}

export function parseReqestBody<Body>(schema: Schema.Schema<Body>) {
	return pipe(
		getRequest(),
		Effect.flatMap((request) => Effect.promise(() => request.formData())),
		Effect.map(Object.fromEntries),
		Effect.flatMap(Schema.validate(schema)),
	)
}
