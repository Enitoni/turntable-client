import type { Player, QueueItem, Room, RoomMember } from "../../../api"
import { SeekBar } from "../player/SeekBar"
import { TrackCover } from "../track/TrackCover"
import { UserAvatar } from "../user/UserAvatar"

export interface RoomHeroProps {
	player?: Player | null
	currentQueueItem?: QueueItem
	room: Room
}

export function RoomHero(props: RoomHeroProps) {
	const { player, currentQueueItem, room } = props

	return (
		<div className="p-6 card">
			{currentQueueItem
				? renderPlayerContent(player as Player, currentQueueItem, room)
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

function renderPlayerContent(player: Player, currentItem: QueueItem, room: Room) {
	const member = room.members.find((member) => member.user.id === currentItem.userId) as RoomMember

	return (
		<div className="flex">
			<TrackCover className="size-[200px]" track={currentItem.track} />
			<div className="flex flex-col flex-1 py-1 ml-6 ">
				<div className="flex items-start flex-1">
					<div className="flex-1">
						<h2 className="text-lg font-bold leading-6 line-clamp-2 text-ellipsis">
							<a target="_blank" href={currentItem.track.canonical} rel="noopener noreferrer">{currentItem.track.title}</a>
						</h2>
						<h3 className="font-medium ">by {currentItem.track.artist}</h3>
					</div>
					<div className="flex items-center flex-shrink-0 pl-6 ">
						<span className="font-medium">{member.user.displayName} queued this</span>
						<div className="ml-4 border-2 rounded-full border-white/10 overflow-clip">
							<UserAvatar user={member.user} className="size-8" />
						</div>
					</div>
				</div>
				<SeekBar player={player} currentItem={currentItem} roomId={room.id} />
			</div>
		</div>
	)
}
