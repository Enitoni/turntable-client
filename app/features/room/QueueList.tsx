import type { Queue, QueueItem } from "../../../api"
import { QueueListItem } from "./QueueListItem"

export interface QueueListProps {
	queue: Queue
}

export function QueueList(props: QueueListProps) {
	const { queue } = props

	return (
		<div className="flex flex-col gap-4">
			{queue.items.slice(1).map((item) => (
				<QueueListItem key={item.track.id} item={item} />
			))}
		</div>
	)
}
