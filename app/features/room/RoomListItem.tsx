import { Link } from "@remix-run/react"
import type { Room } from "../../../api"

export interface RoomListItemProps {
	room: Room
}

export function RoomListItem(props: RoomListItemProps) {
	const { room } = props

	return (
		<Link to={`/room/${room.slug}`} className="flex p-3 px-4 card">
			<h2 className="mt-1 text-xl font-bold font-display">{room.title}</h2>
		</Link>
	)
}
