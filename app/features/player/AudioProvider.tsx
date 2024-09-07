import React, { useEffect } from "react"
import { clientOnly$ } from "vite-env-only/macros"

const globalAudio = clientOnly$(new Audio()) as HTMLAudioElement
const globalAudioContext = clientOnly$(new AudioContext())

export function AudioProvider(props: React.PropsWithChildren<{ streamUrl: string }>) {
	const { streamUrl } = props

	useEffect(() => {
		globalAudio.src = `${streamUrl}?x=${Date.now()}`
		globalAudio.play()

		return () => {
			globalAudio.src = ""
		}
	}, [streamUrl])

	return (
		<AudioProviderContext.Provider value={mockAudioProviderContext}>
			{props.children}
		</AudioProviderContext.Provider>
	)
}

const AudioProviderContext = React.createContext<AudioProviderContext | undefined>(undefined)

export interface AudioProviderContext {
	connect(token: string): void
}

const mockAudioProviderContext: AudioProviderContext = {
	connect: () => {},
}
