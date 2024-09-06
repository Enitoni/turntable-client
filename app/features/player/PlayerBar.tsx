import type { Player } from "../../../api"
import { PlayerTransport } from "./PlayerTransport"

export interface PlayerBarProps {
	roomId: number
	player?: Player
}

export function PlayerBar(props: PlayerBarProps) {
	const { roomId, player } = props

	return (
		<div className="card h-[74px] flex items-center px-6">
			<PlayerTransport player={player} roomId={roomId} />
		</div>
	)
}
