import { Virtuoso } from "react-virtuoso"
import { twMerge } from "tailwind-merge"
import type { Queue } from "../../../api"
import { QueueListItem } from "./QueueListItem"

export interface QueueListProps {
	queue: Queue
}

export function QueueList(props: QueueListProps) {
	const { queue } = props

	return (
		<Virtuoso
			className="flex flex-col gap-6"
			data={queue.items.slice(1)}
			itemContent={(i, item) => (
				<div className={twMerge("py-3", i === 0 && "pt-0", i === queue.items.length - 2 && "pb-0")}>
					<QueueListItem key={item.track.id} item={item} />
				</div>
			)}
		/>
	)
}
