import { Schema } from "@effect/schema"
import type { ParseError } from "@effect/schema/ParseResult"
import { unstable_defineAction, unstable_defineLoader } from "@remix-run/node"
import type { Params } from "@remix-run/react"
import type { unstable_Loader } from "@remix-run/server-runtime"
import type { ResponseStub } from "@remix-run/server-runtime/dist/single-fetch"
import { Context, Effect, pipe } from "effect"
import type { TurntableApiError } from "./api.ts"

interface DataFunctionContext {
	request: Request
	params: Params<string>
	response: ResponseStub
}

class DataFunctionContextService extends Context.Tag("DataFunctionService")<
	DataFunctionContextService,
	DataFunctionContext
>() {}
export type { DataFunctionContextService }

export type DataFunctionServices = DataFunctionContextService

export function getRequest() {
	return DataFunctionContextService.pipe(Effect.map((context) => context.request))
}

export function getParams() {
	return DataFunctionContextService.pipe(Effect.map((context) => context.params))
}

export function getResponse() {
	return DataFunctionContextService.pipe(Effect.map((context) => context.response))
}

// EXPORT THIS I SWEAR TO GOD
type DataFunctionOutput = Exclude<ReturnType<unstable_Loader>, Promise<unknown>>

export function effectLoader<Output extends DataFunctionOutput>(
	effect: Effect.Effect<Output, ThrownRedirect, DataFunctionServices>,
) {
	return unstable_defineLoader(async function loader(args) {
		const result = await pipe(
			effect,
			Effect.provideService(DataFunctionContextService, args),
			Effect.catchTag("ThrownRedirect", (thrown) => Effect.succeed(thrown)),
			Effect.runPromise,
		)
		if (result instanceof ThrownRedirect) {
			throw result.response
		}
		return result
	})
}

export function effectAction<Output extends DataFunctionOutput>(
	effect: Effect.Effect<
		Output,
		ThrownRedirect | TurntableApiError | ParseError,
		DataFunctionServices
	>,
) {
	return unstable_defineAction(async function action(args) {
		const result = await pipe(
			effect,
			Effect.provideService(DataFunctionContextService, args),
			Effect.catchTags({
				ThrownRedirect: (thrown) => Effect.succeed(thrown),
				TurntableApiError: (error) => {
					args.response.status = error.details.status === 400 ? 500 : error.details.status
					return Effect.succeed({ error: String(error.details.body) })
				},
				ParseError: (error) => {
					args.response.status = 422
					return Effect.succeed({ error: error.message })
				},
			}),
			Effect.runPromise,
		)
		if (result instanceof ThrownRedirect) {
			throw result.response
		}
		return result
	})
}

export function parseReqestBody<Body>(schema: Schema.Schema<Body>) {
	return pipe(
		getRequest(),
		Effect.flatMap((request) => Effect.promise(() => request.formData())),
		Effect.map(Object.fromEntries),
		Effect.flatMap(Schema.validate(schema)),
	)
}

export class ThrownRedirect {
	readonly _tag = "ThrownRedirect"
	constructor(readonly response: ResponseStub) {}
}

export function redirect(url: string, status = 303) {
	return Effect.gen(function* () {
		const response = yield* getResponse()
		response.headers.set("Location", url)
		response.status = status
		return yield* Effect.fail(new ThrownRedirect(response))
	})
}
