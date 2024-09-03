import { useState } from "react"
import type { Player, QueueItem, Room, RoomMember } from "../../../api"
import { ProgressBar } from "../../components/ProgressBar"
import { humanizeSeconds } from "../core/helpers"
import { useServerEvent } from "../realtime/hooks"
import { TrackCover } from "../track/TrackCover"
import { UserAvatar } from "../user/UserAvatar"

export interface RoomHeroProps {
	player?: Player | null
	room: Room
}

export function RoomHero(props: RoomHeroProps) {
	const { player, room } = props

	return (
		<div className="p-6 card">
			{player?.currentItem
				? renderPlayerContent(player, player.currentItem, room)
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
	const member = room.members.find((member) => member.id === currentItem.userId) as RoomMember

	return (
		<div className="flex">
			<TrackCover className="size-[200px]" track={currentItem.track} />
			<div className="flex flex-col flex-1 py-1 ml-6 ">
				<div className="flex items-start flex-1">
					<div className="flex-1">
						<h2 className="text-lg font-bold leading-6">{currentItem.track.title}</h2>
						<h3 className="font-medium ">by {currentItem.track.artist}</h3>
					</div>
					<div className="flex items-center flex-shrink-0 pl-6 ">
						<span className="font-medium">{member.user.displayName} queued this</span>
						<div className="ml-4 border-2 rounded-full border-white/10 overflow-clip">
							<UserAvatar user={member.user} className="size-8" />
						</div>
					</div>
				</div>
				<PlayerProgress player={player} currentItem={currentItem} roomId={room.id} />
			</div>
		</div>
	)
}

interface PlayerProgressProps {
	player: Player
	currentItem: QueueItem
	roomId: number
}

function PlayerProgress(props: PlayerProgressProps) {
	const { player, currentItem, roomId } = props
	const [currentTime, setCurrentTime] = useState(player.currentTime)

	const humanizedTime = humanizeSeconds(currentTime)
	const humaizedDuration = humanizeSeconds(currentItem.track.duration)

	useServerEvent((event) => {
		// @ts-expect-error: event type is wrong
		if (event.type === "player-time-update" && event.room_id === roomId) {
			// @ts-expect-error: event type is wrong
			setCurrentTime(event.position)
		}
	})

	return (
		<div className="flex items-center gap-4">
			<span className="text-sm font-semibold">{humanizedTime}</span>
			<ProgressBar progress={currentTime / currentItem.track.duration} />
			<span className="text-sm font-semibold">{humaizedDuration}</span>
		</div>
	)
}
