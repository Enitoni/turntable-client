import type { QueueItem } from "../../../api"
import { humanizeSeconds } from "../core/helpers"
import { TrackCover } from "../track/TrackCover"

export interface QueueListItemProps {
	item: QueueItem
}

export function QueueListItem(props: QueueListItemProps) {
	const { item } = props

	return (
		<div className="flex items-center gap-4">
			<div className="border-2 rounded-md border-white/10 overflow-clip">
				<a target="_blank" href={item.track.canonical}><TrackCover track={item.track} className="size-10" /></a>
			</div>
			<div className="flex flex-col gap-1">
				<div className="flex flex-col">
					<span className="font-medium line-clamp-1 text-ellipsis">
						<a target="_blank" href={item.track.canonical}>{item.track.artist} - {item.track.title}</a>
					</span>
					<span className="text-sm text-neutral-light-500 mt-[-0.1rem]">
						{humanizeSeconds(item.track.duration)}
					</span>
				</div>
			</div>
		</div>
	)
}
