import { useState } from "react"
import { twMerge } from "tailwind-merge"
import type { Player, QueueItem } from "../../../api"
import { humanizeSeconds } from "../core/helpers"
import { SliderInput } from "../input/SliderInput"
import { useServerEvent } from "../realtime/hooks"
import { seekTo } from "../room/actions"

interface PlayerProgressProps {
	player: Player
	currentItem: QueueItem
	roomId: number
}

export function SeekBar(props: PlayerProgressProps) {
	const { player, currentItem, roomId } = props

	const [currentTime, setCurrentTime] = useState(player.currentTime)

	const [seekValue, setSeekValue] = useState(0)
	const [isScrubbing, setIsScrubbing] = useState(false)
	const [isSeeking, setIsSeeking] = useState(false)

	const usedValue = isSeeking ? seekValue : currentTime
	const usedTimeValue = isScrubbing ? seekValue : usedValue

	const humanizedTime = humanizeSeconds(usedTimeValue)
	const humaizedDuration = humanizeSeconds(currentItem.track.duration)

	useServerEvent((event) => {
		// @ts-expect-error: event type is wrong
		if (event.type === "player-time-update" && event.room_id === roomId) {
			// @ts-expect-error: event type is wrong
			setCurrentTime(event.position)
		}
	})

	const handleSeek = (value: number) => {
		setSeekValue(value * currentItem.track.duration)
		setIsScrubbing(false)
		setIsSeeking(true)

		seekTo(roomId, value * currentItem.track.duration).finally(() => {
			setTimeout(() => setIsSeeking(false), 50)
		})
	}

	const handleScrub = (value: number) => {
		setSeekValue(value * currentItem.track.duration)
		setIsScrubbing(true)
	}

	return (
		<div
			className={twMerge("flex items-center gap-4 transition ", isSeeking && "pointer-events-none")}
		>
			<span className="text-sm font-semibold tabular">{humanizedTime}</span>
			<SliderInput
				disabled={isSeeking}
				onValueCommit={handleSeek}
				onValueChange={handleScrub}
				value={usedValue / currentItem.track.duration}
			/>
			<span className="text-sm font-semibold tabular-nums">{humaizedDuration}</span>
		</div>
	)
}
