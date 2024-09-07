import { SkipBack, SkipForward } from "lucide-react"
import type { Player } from "../../../api"
import { AsyncButton } from "../../components/AsyncButton"
import { performRoomAction } from "../room/actions"
import { PlayButton } from "./PlayButton"

export interface PlayerTransportProps {
	roomId: number
	player?: Player
}

export function PlayerTransport(props: PlayerTransportProps) {
	const { roomId, player } = props

	const navigate = (direction: string) => performRoomAction(roomId, direction)

	return (
		<div className="flex items-center gap-4">
			<AsyncButton className="icon-button" onClick={() => navigate("previous")}>
				<SkipBack className="icon" />
			</AsyncButton>
			<PlayButton roomId={roomId} player={player} />
			<AsyncButton className="icon-button" onClick={() => navigate("next")}>
				<SkipForward className="icon" />
			</AsyncButton>
		</div>
	)
}
