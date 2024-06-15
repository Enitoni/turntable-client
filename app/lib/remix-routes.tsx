// it is best for your sanity that you ignore this file

import {
	Link,
	type LinkProps,
	NavLink,
	type NavLinkProps,
	useNavigate,
	useParams,
} from "@remix-run/react"
import { $params, $path, type Routes, type RoutesWithParams } from "remix-routes"

interface BaseLinkPropsWithoutParams<To extends keyof Routes> {
	to: To
	params?: never
	query?: Routes[To]["query"]
}

interface BaseLinkPropsWithParams<To extends keyof Routes> {
	to: To
	params: Routes[To]["params"]
	query?: Routes[To]["query"]
}

type BaseLinkProps<To extends keyof Routes> = Routes[To]["params"] extends Record<string, never>
	? BaseLinkPropsWithoutParams<To>
	: BaseLinkPropsWithParams<To>

type LinkTypedProps<To extends keyof Routes> = Omit<LinkProps, "to"> & BaseLinkProps<To>

export function LinkTyped<Route extends keyof Routes>({
	params,
	query,
	...props
}: LinkTypedProps<Route>) {
	// @ts-expect-error
	const to = params ? $path(props.to, params, query) : $path(props.to, query)
	return <Link {...props} to={to} />
}

type NavLinkTypedProps<To extends keyof Routes> = Omit<NavLinkProps, "to"> & BaseLinkProps<To>

export function NavLinkTyped({ params, query, ...props }: NavLinkTypedProps<keyof Routes>) {
	// @ts-expect-error
	const to = params ? $path(props.to, params, query) : $path(props.to, query)
	return <NavLink {...props} to={to} />
}

export function useNavigateTyped() {
	const navigate = useNavigate()
	return <Route extends keyof Routes>(
		...args: Route extends keyof RoutesWithParams
			? [to: Route, params: Routes[Route]["params"], query?: Routes[Route]["query"]]
			: [to: Route, query?: Routes[Route]["query"]]
	) => {
		navigate(
			$path(
				// the weird placement of this is to ensure only this error is suppressed
				// @ts-expect-error
				...args,
			),
		)
	}
}

export function useParamsTyped<Route extends keyof RoutesWithParams>(route: Route) {
	return $params(route, useParams())
}
