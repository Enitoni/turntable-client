import { twMerge } from "tailwind-merge"
import type { User } from "../../../api"

export interface UserAvatarProps {
	user: User
	className?: string
}

export function UserAvatar(props: UserAvatarProps) {
	const { user, className } = props
	return (
		<div className={twMerge("flex items-center justify-center bg-neutral-dark-100", className)}>
			<span className="font-bold uppercase font-display">{user.displayName[0] ?? "?"}</span>
		</div>
	)
}
