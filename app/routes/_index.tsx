import type { LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { TurntableApi } from "../../api/TurntableApi.ts"
import { tokenCookie } from "../auth.ts"

export async function loader({ request }: LoaderFunctionArgs) {
	const token = await tokenCookie.parse(request.headers.get("Cookie"))
	if (!token) {
		return { user: null }
	}

	const api = new TurntableApi({
		BASE: "http://localhost:9050",
		HEADERS: {
			Authorization: `Bearer ${token}`,
		},
	})

	return { user: await api.auth.user() }
}

export default function Index() {
	const { user } = useLoaderData<typeof loader>()
	return <div className="font-sans p-4">{JSON.stringify(user, null, 2)}</div>
}
