import { useRef, useState } from "react"
import type { Room, RoomConnection, RoomMember } from "../../../api"
import { useServerEvent } from "../realtime/hooks"
import { RoomMemberListItem } from "./RoomMemberListItem"

export interface RoomMemberListProps {
	room: Room
}

// dear god this is a mess

export function RoomMemberList(props: RoomMemberListProps) {
	const { room } = props
	const { members } = room

	const connections = useRef(connectionsToMap(room.members, room.connections))
	const [_, forceUpdate] = useState(0)

	const mappedMembers = members.map((member) => ({
		member,
		connection: connections.current[member.id]?.values().next().value,
	}))

	useServerEvent((event) => {
		// @ts-expect-error: event type is wrong
		if (event.type === "user-disconnected" && event.room_id === room.id) {
			// @ts-expect-error: event type is wrong
			connections.current[event.user_id]?.delete(event.source)
			forceUpdate((x) => x + 1)
		}

		// @ts-expect-error: event type is wrong
		if (event.type === "user-connected" && event.room_id === room.id) {
			// @ts-expect-error: event type is wrong
			connections.current[event.user_id]?.add(event.source)
			forceUpdate((x) => x + 1)
		}
	})

	return (
		<div className="flex flex-col gap-4">
			{mappedMembers.map((item) => (
				<RoomMemberListItem
					key={item.member.id}
					member={item.member}
					connection={item.connection}
				/>
			))}
		</div>
	)
}

type ConnectionMap = Record<number, Set<string>>

function connectionsToMap(members: RoomMember[], connections: RoomConnection[]): ConnectionMap {
	const map: ConnectionMap = {}

	for (const member of members) {
		map[member.id] = new Set()
	}

	for (const connection of connections) {
		map[connection.userId]?.add(connection.source)
	}

	return map
}
