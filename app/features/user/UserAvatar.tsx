import { twMerge } from "tailwind-merge"
import type { User } from "../../../api"

export interface UserAvatarProps {
	user: User
	className?: string
}

export function UserAvatar(props: UserAvatarProps) {
	const { user, className } = props
	return (
		<div
			className={twMerge(
				"flex items-center select-none @container justify-center bg-neutral-dark-100",
				className,
			)}
		>
			<span className="mt-[14cqw] font-bold uppercase font-display text-[50cqw]">
				{user.displayName[0] ?? "?"}
			</span>
		</div>
	)
}
