import type { RoomInvite } from "../../../api"
import { UserAvatar } from "../user/UserAvatar"

export interface InviteNoticeProps {
	invite: RoomInvite
}

export function InviteNotice(props: InviteNoticeProps) {
	const { invite } = props

	return (
		<div className="flex flex-col items-center gap-4">
			<h2 className="text-4xl font-bold text-transparent bg-gradient-angled to-[#4690FF] via-[#702DFF] from-[#D020ED] font-display bg-clip-text">
				You've been invited to join
			</h2>
			<div className="flex items-center gap-4">
				<div className="border-2 rounded-full border-white/10 overflow-clip">
					<UserAvatar user={invite.inviter} className="size-16" />
				</div>
				<div className="flex flex-col">
					<span className="text-2xl font-bold font-display">{invite.roomTitle}</span>
					<span className="text-neutral-light-500 mt-[-0.3rem]">
						Room by {invite.inviter.displayName}
					</span>
				</div>
			</div>
		</div>
	)
}
