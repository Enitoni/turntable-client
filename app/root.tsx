import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react"
import { AppHeader } from "./components/AppHeader.tsx"
import "./tailwind.css"

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="bg-darkest text-white">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				<AppHeader />
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export default function App() {
	return <Outlet />
}
