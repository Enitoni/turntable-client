import { Button } from "../../components/Button"
import { useAudio } from "./hooks"

export function NotAllowedWarning() {
	const audio = useAudio()

	if (audio.status !== "autoplay-error") {
		return null
	}

	return (
		<div className="flex z-50 fixed flex-col top-0 bottom-0 left-0 right-0 gap-8 bg-black/50 items-center justify-center min-h-[248px]">
			<div className="flex flex-col items-center gap-1">
				<span className="text-lg font-bold font-display">Failed to connect to stream</span>
				<span>Please allow autoplay in your browser settings, or click the button below</span>
			</div>
			<Button className="primary-button" onClick={audio.reconnect}>
				Reconnect
			</Button>
		</div>
	)
}
