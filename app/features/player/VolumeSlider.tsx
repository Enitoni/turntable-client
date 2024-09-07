import { Volume1, Volume2, VolumeX } from "lucide-react"
import { Button } from "../../components/Button"
import { SliderInput } from "../input/SliderInput"
import { useAudio } from "./hooks"

export function VolumeSlider() {
	const player = useAudio()

	const getIcon = () => {
		if (player.volume === 0 || player.muted) {
			return VolumeX
		}

		if (player.volume < 0.5) {
			return Volume1
		}

		return Volume2
	}

	const Icon = getIcon()

	return (
		<div className="flex items-center gap-4 min-w-48">
			<Button onClick={player.toggleMute} className="flex-shrink-0 icon-button">
				<Icon className="icon" />
			</Button>
			<SliderInput value={player.volume} onValueChange={player.setVolume} />
		</div>
	)
}
