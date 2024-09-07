import type { Player } from "../../../api"
import { PlayerTransport } from "./PlayerTransport"
import { QueueSubmissionField } from "./QueueSubmissionField"
import { VolumeSlider } from "./VolumeSlider"

export interface PlayerBarProps {
	roomId: number
	player?: Player
}

export function PlayerBar(props: PlayerBarProps) {
	const { roomId, player } = props

	return (
		<div className="card h-[74px] flex items-center px-6 gap-8">
			<PlayerTransport player={player} roomId={roomId} />
			<QueueSubmissionField roomId={roomId} />
			<VolumeSlider />
		</div>
	)
}
