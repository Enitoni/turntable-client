import { Link, useActionData, useLoaderData } from "@remix-run/react"
import { Effect } from "effect"
import { UserPlus } from "lucide-react"
import { AppLogo } from "../components/AppLogo.tsx"
import { FormButton } from "../features/form/FormButton.tsx"
import { FormError } from "../features/form/FormError.tsx"
import { TextField } from "../features/form/TextField.tsx"
import { ZodForm } from "../features/form/ZodForm.tsx"
import { formEffectAction, withSubmissionParser } from "../features/form/helpers.server.ts"
import { registerSchema } from "../features/form/schema.ts"
import { InviteNotice } from "../features/room/InviteNotice.tsx"
import { getInviteIfSpecified } from "../features/room/helpers.ts"
import {
	getAuthorizedTurntableApi,
	getTurntableApi,
	resolveApiResponse,
} from "../lib/api.server.ts"
import { getCookieToken } from "../lib/auth.ts"
import { effectLoader, redirect } from "../lib/data.server.ts"

export const loader = effectLoader(
	Effect.gen(function* () {
		const invite = yield* getInviteIfSpecified()

		return yield* Effect.matchEffect(getAuthorizedTurntableApi(), {
			onSuccess: () => (invite ? redirect(`/invite/${invite.token}`) : redirect("/")),
			onFailure: () => Effect.succeed({ invite }),
		})
	}),
)

export const action = formEffectAction(
	withSubmissionParser(registerSchema, (value) =>
		Effect.gen(function* () {
			const invite = yield* getInviteIfSpecified()
			const api = getTurntableApi()

			yield* resolveApiResponse(api.auth.register({ ...value, inviteToken: invite?.token }))

			const response = yield* resolveApiResponse(
				api.auth.login({ username: value.username, password: value.password }),
			)

			const cookie = yield* getCookieToken(response.token)

			return yield* redirect(invite ? `/invite/${invite.token}` : "/", {
				headers: { "Set-Cookie": cookie },
			})
		}),
	),
)

export default function RouteComponent() {
	const { invite } = useLoaderData<typeof loader>()
	const lastResult = useActionData<typeof action>()

	return (
		<div className="flex flex-col items-center justify-center w-screen h-screen">
			<div className="flex flex-col items-center gap-16">
				<AppLogo className="mb-16" />
				{invite ? <InviteNotice invite={invite} /> : null}
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
										<Link to={invite ? `/login?invite=${invite.token}` : "/login"} className="link">
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
