import { Schema } from "@effect/schema"
import type { ParseError } from "@effect/schema/ParseResult"
import { unstable_defineAction, unstable_defineLoader } from "@remix-run/node"
import { unstable_data as data, redirect as remixRedirect } from "@remix-run/node"
import type { Params } from "@remix-run/react"
import type { unstable_Loader } from "@remix-run/server-runtime"
import { Context, Effect, pipe } from "effect"
import type { TurntableApiError } from "./api.ts"

interface DataFunctionContext {
	request: Request
	params: Params<string>
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
					return Effect.succeed(
						data(
							{ error: String(error.details.body) },
							{ status: error.details.status === 400 ? 500 : error.details.status },
						),
					)
				},
				ParseError: (error) => {
					return Effect.succeed(data({ error: error.message }, { status: 422 }))
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
	constructor(readonly response: Response) {}
}

export function redirect(url: string, options: ResponseInit | number = 303) {
	return Effect.gen(function* () {
		return yield* Effect.fail(new ThrownRedirect(remixRedirect(url, options)))
	})
}
