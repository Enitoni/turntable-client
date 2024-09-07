import type { MetaFunction } from "@remix-run/node"
import { Link, useActionData, useLoaderData } from "@remix-run/react"
import { Effect } from "effect"
import { LogIn } from "lucide-react"
import { AppLogo } from "../components/AppLogo.tsx"
import { createMeta } from "../features/core/helpers.ts"
import { FormButton } from "../features/form/FormButton.tsx"
import { FormError } from "../features/form/FormError.tsx"
import { TextField } from "../features/form/TextField.tsx"
import { ZodForm } from "../features/form/ZodForm.tsx"
import { formEffectAction, withSubmissionParser } from "../features/form/helpers.server.ts"
import { loginSchema } from "../features/form/schema.ts"
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
	withSubmissionParser(loginSchema, (value) =>
		Effect.gen(function* () {
			const invite = yield* getInviteIfSpecified()
			const api = getTurntableApi()

			const response = yield* resolveApiResponse(api.auth.login(value))
			const cookie = yield* getCookieToken(response.token)

			return yield* redirect(invite ? `/invite/${invite.token}` : "/", {
				headers: { "Set-Cookie": cookie },
			})
		}),
	),
)

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	const invite = data?.invite

	if (invite) {
		return createMeta({
			title: `You've been invited to join a room!`,
			description: `Sign in or create an account to join ${invite.roomTitle}`,
		})
	}

	return createMeta({
		title: "Sign in",
		description: "Sign in to listen to music with your friends",
	})
}

export default function RouteComponent() {
	const { invite } = useLoaderData<typeof loader>()
	const lastResult = useActionData<typeof action>()

	return (
		<div className="flex flex-col items-center justify-center w-screen h-screen">
			<div className="flex flex-col items-center gap-16">
				<AppLogo />
				{invite ? <InviteNotice invite={invite} /> : null}
				<div className="p-6 card min-w-[412px]">
					<h1 className="mb-6 title">Sign in</h1>
					<ZodForm
						className="flex flex-col gap-6"
						lastResult={lastResult ?? null}
						schema={loginSchema}
					>
						{(fields, state) => (
							<>
								<TextField field={fields.username} label={"Username"} required />
								<TextField field={fields.password} label={"Password"} type="password" required />
								<div className="w-full">
									<FormError state={state} />
									<div className="flex items-center justify-between">
										<Link
											to={invite ? `/register?invite=${invite.token}` : "/register"}
											className="link"
										>
											Create new account instead
										</Link>
										<FormButton
											state={state}
											iconSlot={<LogIn />}
											label={"Sign in"}
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
