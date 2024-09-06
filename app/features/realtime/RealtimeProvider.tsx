import { useEffect, useRef } from "react"
import React from "react"
import type { ServerEvent } from "../../../api"

export type EventListener = (event: ServerEvent) => void

export interface RealtimeProviderProps {
	baseUrl: string
	children: React.ReactNode
}

export interface RealtimeContextData {
	addListener: (listener: EventListener) => void
	removeListener: (listener: EventListener) => void
}

export const RealtimeContext = React.createContext<RealtimeContextData | null>(null)

export function RealtimeProvider(props: RealtimeProviderProps) {
	const listeners = useRef<EventListener[]>([])

	useEffect(() => {
		console.log("creating event source")
		const eventSource = new EventSource(`${props.baseUrl}/v1/events`)

		eventSource.onmessage = (event) => {
			const data = JSON.parse(event.data) as ServerEvent

			for (const listener of listeners.current) {
				listener(data)
			}
		}

		return () => {
			eventSource.close()
		}
	})

	return (
		<RealtimeContext.Provider
			value={{
				addListener: (listener) => {
					listeners.current.push(listener)
				},
				removeListener: (listener) => {
					listeners.current = listeners.current.filter((l) => l !== listener)
				},
			}}
		>
			{props.children}
		</RealtimeContext.Provider>
	)
}
