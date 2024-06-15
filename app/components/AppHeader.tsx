import { LinkTyped, useNavigateTyped } from "~/lib/remix-routes.tsx"
import { AppLogo } from "./AppLogo.tsx"
import { UserButton } from "./UserButton.tsx"

export function AppHeader() {
	const navigate = useNavigateTyped()
	return (
		<header className="bg-darkish px-4 h-16 justify-between flex items-center">
			<LinkTyped
				to="/"
				className="hover:scale-105 transition-transform active:scale-100 active:duration-0"
				onContextMenu={(event) => {
					event.preventDefault()
					navigate("/design")
				}}
			>
				<AppLogo className="h-10 w-auto" />
			</LinkTyped>
			<UserButton />
		</header>
	)
}
