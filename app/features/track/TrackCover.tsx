import { twMerge } from "tailwind-merge"
import type { Track } from "../../../api"

export interface TrackCoverProps {
	track: Track
	className?: string
}

export function TrackCover(props: TrackCoverProps) {
	const { track, className } = props

	return (
		<div className={twMerge("shadow rounded-md overflow-hidden", className)}>
			{track.artwork ? (
				<img src={track.artwork} alt={track.title} className="object-cover w-full h-full" />
			) : null}
		</div>
	)
}
