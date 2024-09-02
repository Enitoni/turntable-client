import type { User } from "../../../api"
import { UserAvatar } from "./UserAvatar"

export interface UserButtonProps {
	user: User
}

export function UserButton(props: UserButtonProps) {
	return (
		<button type="button" className="border-2 rounded-full border-white/10 overflow-clip">
			<UserAvatar user={props.user} className="size-8" />
		</button>
	)
}
