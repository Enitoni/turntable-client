import type { Submission } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import {
	json,
	unstable_composeUploadHandlers,
	unstable_createFileUploadHandler,
	unstable_createMemoryUploadHandler,
	unstable_parseMultipartFormData,
} from "@remix-run/node"
import { unstable_data as data } from "@remix-run/node"
import { Effect, pipe } from "effect"
import type { ZodType } from "zod"
import { getRequest } from "../../lib/data"

export class InvalidFormError {
	readonly _tag = "InvalidForm"
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
	if (error instanceof InvalidFormError) {
		// @ts-expect-error: remix sucks
		return data(submission.reply({ formErrors: ["errors.invalidForm"] }), {
			status: 400,
		})
	}

	console.error(error)

	// @ts-expect-error: remix sucks
	return data(submission.reply({ formErrors: ["errors.unknown"] }), {
		status: 500,
	})
}
