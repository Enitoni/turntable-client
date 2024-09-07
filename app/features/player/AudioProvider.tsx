import React, { useEffect, useState } from "react"
import { clientOnly$ } from "vite-env-only/macros"

const globalAudio = clientOnly$(new Audio()) as HTMLAudioElement
const globalAudioContext = clientOnly$(new AudioContext())

export function AudioProvider(props: React.PropsWithChildren<{ streamUrl: string }>) {
	const { streamUrl } = props

	const [volume, setVolume] = useState(globalAudio?.volume ?? 1)
	const [muted, setMuted] = useState(globalAudio?.muted ?? false)

	useEffect(() => {
		globalAudio.src = `${streamUrl}?x=${Date.now()}`
		globalAudio.play()

		return () => {
			globalAudio.src = ""
		}
	}, [streamUrl])

	const handleSetVolume = (volume: number) => {
		globalAudio.volume = volume
		setVolume(volume)
	}

	const handleToggleMute = () => {
		globalAudio.muted = !muted
		setMuted(!muted)
	}

	return (
		<AudioProviderContext.Provider
			value={{ volume, muted, setVolume: handleSetVolume, toggleMute: handleToggleMute }}
		>
			{props.children}
		</AudioProviderContext.Provider>
	)
}

export const AudioProviderContext = React.createContext<AudioProviderContext | undefined>(undefined)

export interface AudioProviderContext {
	volume: number
	muted: boolean
	setVolume(volume: number): void
	toggleMute(): void
}
