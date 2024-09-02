import { Link } from "@remix-run/react"
import type { User } from "../../api/index.ts"
import { UserButton } from "../features/user/UserButton.tsx"
import { AppLogo } from "./AppLogo.tsx"

export interface AppHeaderProps {
	user: User
}

export function AppHeader(props: AppHeaderProps) {
	return (
		<header className="flex items-center justify-between h-16 px-4 bg-darkish">
			<Link to="/">
				<AppLogo className="w-auto h-10" />
			</Link>
			<UserButton user={props.user} />
		</header>
	)
}
