import type { Submission } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import {
	json,
	unstable_composeUploadHandlers,
	unstable_createFileUploadHandler,
	unstable_createMemoryUploadHandler,
	unstable_defineAction,
	unstable_parseMultipartFormData,
} from "@remix-run/node"
import { unstable_data as data } from "@remix-run/node"
import { Effect, pipe } from "effect"
import type { ZodType } from "zod"
import { TurntableApiError } from "../../lib/api.server"
import {
	DataFunctionContextService,
	type DataFunctionOutput,
	type DataFunctionServices,
	ThrownRedirect,
	getRequest,
} from "../../lib/data"

export class InvalidFormError {
	readonly _tag = "InvalidForm"
}

export function formEffectAction<Output extends DataFunctionOutput>(
	effect: Effect.Effect<Output, ThrownRedirect | TurntableApiError, DataFunctionServices>,
) {
	return unstable_defineAction(async function action(args) {
		const result = await pipe(
			effect,
			Effect.provideService(DataFunctionContextService, args),
			Effect.runPromise,
		)
		if (result instanceof ThrownRedirect) {
			throw result.response
		}
		return result
	})
}

export const parseSubmissionFromRequest = <T>(schema: ZodType<T>) =>
	Effect.gen(function* () {
		const request = yield* getRequest()

		const uploadHandler = unstable_composeUploadHandlers(
			unstable_createFileUploadHandler({
				maxPartSize: 5_000_000,
				file: ({ filename }) => filename,
			}),
			// parse everything else into memory
			unstable_createMemoryUploadHandler(),
		)

		const formData = yield* Effect.promise(() =>
			unstable_parseMultipartFormData(request, uploadHandler),
		)

		return parseWithZod(formData, { schema })
	})

export function withSubmissionParser<T, V, E, D>(
	schema: ZodType<T>,
	callback: (submission: T) => Effect.Effect<V, D, E>,
) {
	return pipe(
		parseSubmissionFromRequest(schema),
		Effect.flatMap((submission) => {
			return pipe(
				Effect.flatMap(
					submission.status !== "success"
						? Effect.fail(new InvalidFormError())
						: Effect.succeed(submission.value),
					(value) => callback(value),
				),
				handleErrorForForm(submission),
			)
		}),
	)
}

export const handleErrorForForm =
	(submission: Submission<unknown>) =>
	<T, E, D>(effect: Effect.Effect<T, E, D>) =>
		Effect.catchAll(effect, (error) =>
			Effect.succeed(convertErrorToSubmissionReply(submission, error)),
		)

const convertErrorToSubmissionReply = (submission: Submission<unknown>, error: unknown) => {
	if (error instanceof ThrownRedirect) {
		return error.response as never
	}

	if (error instanceof InvalidFormError) {
		return data(submission.reply({ formErrors: ["Invalid form"] }), {
			status: 400,
		})
	}

	if (error instanceof TurntableApiError) {
		return data(submission.reply({ formErrors: [error.details.body] }), {
			status: 400,
		})
	}

	console.error(error)

	return data(submission.reply({ formErrors: ["Unknown error"] }), {
		status: 500,
	})
}
