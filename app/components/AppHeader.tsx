import { LinkTyped } from "~/lib/remix-routes.tsx"
import { AppLogo } from "./AppLogo.tsx"
import { UserButton } from "./UserButton.tsx"

export function AppHeader() {
	return (
		<header className="bg-darkish px-4 h-16 justify-between flex items-center">
			<LinkTyped to="/">
				<AppLogo className="h-10 w-auto" />
			</LinkTyped>
			<UserButton />
		</header>
	)
}
