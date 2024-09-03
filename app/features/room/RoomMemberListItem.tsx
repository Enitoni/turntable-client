import { Crown } from "lucide-react"
import { twMerge } from "tailwind-merge"
import type { RoomMember } from "../../../api"
import { UserAvatar } from "../user/UserAvatar"

export interface RoomMemberListItemProps {
	member: RoomMember
	connection?: string
}

export function RoomMemberListItem(props: RoomMemberListItemProps) {
	const { member, connection } = props

	const subtext = connection ? `Listening on ${connection}` : "Disconnected"
	const disconnectedClass = connection ? null : "opacity-50"

	return (
		<div className={twMerge("flex items-center gap-4", disconnectedClass)}>
			<div className="border-2 rounded-full border-white/10 overflow-clip">
				<UserAvatar user={member.user} className="size-10" />
			</div>
			<div className="flex flex-col gap-1">
				<div className="flex items-center gap-2 leading-3">
					<span className="font-medium">{member.user.displayName}</span>
					{member.owner ? <Crown className="text-golden size-4" /> : null}
				</div>
				<span className="text-sm font-bold mt-[-0.1rem] text-neutral-light-200 flex">
					{subtext}
				</span>
			</div>
		</div>
	)
}
