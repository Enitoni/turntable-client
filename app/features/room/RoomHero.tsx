import type { Player, QueueItem, RoomMember } from "../../../api"
import { TrackCover } from "../track/TrackCover"
import { UserAvatar } from "../user/UserAvatar"

export interface RoomHeroProps {
	player?: Player | null
	members: RoomMember[]
}

export function RoomHero(props: RoomHeroProps) {
	const { player, members } = props

	return (
		<div className="p-6 card">
			{player?.currentItem
				? renderPlayerContent(player, player.currentItem, members)
				: renderEmptyStateContent()}
		</div>
	)
}

function renderEmptyStateContent() {
	return (
		<div className="flex items-center justify-center min-h-[248px]">
			<span className="text-lg font-bold font-display">Nothing is playing</span>
		</div>
	)
}

function renderPlayerContent(player: Player, currentItem: QueueItem, members: RoomMember[]) {
	const member = members.find((member) => member.id === currentItem.userId) as RoomMember

	return (
		<div className="flex">
			<TrackCover className="size-[200px]" track={currentItem.track} />
			<div className="relative flex flex-col flex-1 ml-6">
				<div>
					<h2 className="mb-1 text-xl font-bold leading-6">{currentItem.track.title}</h2>
					<h3 className="text-lg font-medium">by {currentItem.track.artist}</h3>
				</div>
				<div className="absolute top-0 right-0 flex items-center">
					<span className="font-semibold">{member.user.displayName} queued this</span>
					<div className="ml-4 border-2 rounded-full border-white/10 overflow-clip">
						<UserAvatar user={member.user} className="size-8" />
					</div>
				</div>
			</div>
		</div>
	)
}
