import { Link, useActionData } from "@remix-run/react"
import { Effect } from "effect"
import { LogIn, UserPlus } from "lucide-react"
import { AppLogo } from "../components/AppLogo.tsx"
import { FormButton } from "../features/form/FormButton.tsx"
import { FormError } from "../features/form/FormError.tsx"
import { TextField } from "../features/form/TextField.tsx"
import { ZodForm } from "../features/form/ZodForm.tsx"
import { formEffectAction, withSubmissionParser } from "../features/form/helpers.server.ts"
import { registerSchema } from "../features/form/schema.ts"
import {
	getAuthorizedTurntableApi,
	getTurntableApi,
	resolveApiResponse,
} from "../lib/api.server.ts"
import { getCookieToken } from "../lib/auth.ts"
import { effectAction, effectLoader, redirect } from "../lib/data.ts"

export const loader = effectLoader(
	Effect.matchEffect(getAuthorizedTurntableApi(), {
		onSuccess: () => redirect("/"),
		onFailure: () => Effect.succeed(null),
	}),
)

export const action = formEffectAction(
	withSubmissionParser(registerSchema, (value) =>
		Effect.gen(function* () {
			const api = getTurntableApi()
			yield* resolveApiResponse(api.auth.register(value))

			const response = yield* resolveApiResponse(
				api.auth.login({ username: value.username, password: value.password }),
			)

			const cookie = yield* getCookieToken(response.token)

			return yield* redirect("/", {
				headers: { "Set-Cookie": cookie },
			})
		}),
	),
)

export default function RouteComponent() {
	const lastResult = useActionData<typeof action>()

	return (
		<div className="flex flex-col items-center justify-center w-screen h-screen gap-4">
			<div className="flex flex-col items-center">
				<AppLogo className="mb-16" />
				<div className="p-6 card min-w-[412px]">
					<h1 className="mb-6 title">Create account</h1>
					<ZodForm className="flex flex-col gap-6" lastResult={lastResult} schema={registerSchema}>
						{(fields, state) => (
							<>
								<TextField field={fields.username} label={"Username"} required />
								<TextField field={fields.displayName} label={"Display name"} required />
								<TextField field={fields.password} label={"Password"} type="password" required />
								<div className="w-full">
									<FormError state={state} />
									<div className="flex items-center justify-between">
										<Link to="/login" className="link">
											Sign in instead
										</Link>
										<FormButton
											state={state}
											iconSlot={<UserPlus />}
											label={"Create"}
											className="self-start primary-button"
										/>
									</div>
								</div>
							</>
						)}
					</ZodForm>
				</div>
			</div>
		</div>
	)
}
