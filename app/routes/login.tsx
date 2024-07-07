import type { LoaderFunctionArgs } from "@remix-run/node"
import { Form, redirect, useActionData } from "@remix-run/react"
import { ApiError, TurntableApi } from "../../api"
import { tokenCookie } from "../auth"

export async function action({ request }: LoaderFunctionArgs) {
	try {
		const data = await request.formData()

		const api = new TurntableApi({
			BASE: "http://localhost:9050",
		})

		const response = await api.auth.login({
			username: data.get("username") as string,
			password: data.get("password") as string,
		})

		return redirect("/", {
			headers: {
				"Set-Cookie": await tokenCookie.serialize(response.token),
			},
		})
	} catch (error) {
		if (error instanceof ApiError) {
			console.log(error)
			return { error: error.body }
		}
		throw error
	}
}

export default function RouteComponent() {
	const data = useActionData<typeof action>()
	return (
		<Form method="post">
			<input name="username" type="text" className="bg-slate-950 border-white rounded border" />
			<input name="password" type="password" className="bg-slate-950 border-white rounded border" />
			<button type="submit">Submit</button>
			{data?.error && <div className="text-red-400">{data.error}</div>}
		</Form>
	)
}
