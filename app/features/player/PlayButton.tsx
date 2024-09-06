import { useState } from "react"
import type { Player } from "../../../api"
import { AsyncButton } from "../../components/AsyncButton"
import { Spinner } from "../core/Spinner"
import { useServerEvent } from "../realtime/hooks"

export interface PlayButtonProps {
	roomId: number
	player?: Player
}

export function PlayButton(props: PlayButtonProps) {
	const { roomId, player } = props
	const [playerState, setPlayerState] = useState(player?.state ?? "idle")

	useServerEvent((event) => {
		if (event.type === "player-state-update" && event.room_id === roomId) {
			// @ts-expect-error: event type is wrong
			setPlayerState(event.new_state)
		}
	})

	const handleClick = async () =>
		fetch("/api/room-action", {
			method: "POST",
			body: JSON.stringify({
				roomId: roomId,
				action: playerState === "playing" ? "pause" : "play",
			}),
		})

	const renderIcon = () => {
		if (playerState === "buffering") {
			return (
				<div className="size-5">
					<Spinner />
				</div>
			)
		}

		if (playerState === "playing") {
			return pauseIcon()
		}

		return playIcon()
	}

	return (
		<AsyncButton
			className="size-[42px] flex justify-center items-center bg-primary rounded-full shadow-button disabled:opacity-50 transition"
			onClick={handleClick}
		>
			{renderIcon()}
		</AsyncButton>
	)
}

const playIcon = () => (
	<svg
		width="26"
		height="26"
		className="ml-[2px]"
		viewBox="0 0 26 26"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M6.5 3.25L21.6667 13L6.5 22.75V3.25Z" fill="currentColor" />
	</svg>
)

const pauseIcon = () => (
	<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M18.4167 4.33333H16.25C15.6517 4.33333 15.1667 4.81835 15.1667 5.41666V20.5833C15.1667 21.1816 15.6517 21.6667 16.25 21.6667H18.4167C19.015 21.6667 19.5 21.1816 19.5 20.5833V5.41666C19.5 4.81835 19.015 4.33333 18.4167 4.33333Z"
			fill="currentColor"
		/>
		<path
			d="M9.75 4.33333H7.58333C6.98502 4.33333 6.5 4.81835 6.5 5.41666V20.5833C6.5 21.1816 6.98502 21.6667 7.58333 21.6667H9.75C10.3483 21.6667 10.8333 21.1816 10.8333 20.5833V5.41666C10.8333 4.81835 10.3483 4.33333 9.75 4.33333Z"
			fill="currentColor"
		/>
	</svg>
)
