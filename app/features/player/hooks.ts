import { useContext } from "react"
import { AudioProviderContext } from "./AudioProvider"

export const useAudio = () => {
	const context = useContext(AudioProviderContext)

	if (context === null) {
		throw new Error("useAudio must be used within a AudioProvider")
	}

	return context as AudioProviderContext
}
