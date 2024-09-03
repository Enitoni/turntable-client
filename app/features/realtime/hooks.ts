import { useContext, useEffect } from "react"
import type { ServerEvent } from "../../../api"
import { RealtimeContext } from "./RealtimeProvider"

export const useServerEvent = (callback: (event: ServerEvent) => void) => {
	const context = useContext(RealtimeContext)

	if (context === null) {
		throw new Error("useServerEvent must be used within a RealtimeProvider")
	}

	useEffect(() => {
		context.addListener(callback)
		return () => {
			context.removeListener(callback)
		}
	}, [callback, context])
}
