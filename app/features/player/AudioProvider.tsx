import React, { useEffect, useState } from "react"
import { clientOnly$ } from "vite-env-only/macros"
import { useLocalStorage } from "../core/hooks"

const globalAudio = clientOnly$(new Audio()) as HTMLAudioElement
//const globalAudioContext = clientOnly$(new AudioContext())

export type Status = "idle" | "connecting" | "connected" | "error" | "autoplay-error"

export function AudioProvider(props: React.PropsWithChildren<{ streamUrl: string }>) {
	const { streamUrl } = props

	const [volume, setVolume] = useLocalStorage("volume", globalAudio?.volume ?? 1)
	const [muted, setMuted] = useState(globalAudio?.muted ?? false)
	const [status, setStatus] = useState<Status>("idle")

	useEffect(() => {
		globalAudio.volume = volume ** 4
	}, [volume])

	useEffect(() => {
		setStatus("connecting")

		globalAudio.src = `${streamUrl}?x=${Date.now()}`
		globalAudio
			.play()
			.then(() => setStatus("connected"))
			.catch(handleError)

		return () => {
			globalAudio.src = ""
		}
	}, [streamUrl])

	const handleError = (e: unknown) => {
		if (e instanceof DOMException && e.name === "NotAllowedError") {
			setStatus("autoplay-error")
			return
		}

		console.error(e)
		setStatus("error")
	}

	const handleRequestConnection = () => {
		setStatus("connecting")

		globalAudio
			.play()
			.then(() => setStatus("connected"))
			.catch(handleError)
	}

	const handleSetVolume = (volume: number) => {
		setVolume(volume)
	}

	const handleToggleMute = () => {
		globalAudio.muted = !muted
		setMuted(!muted)
	}

	return (
		<AudioProviderContext.Provider
			value={{
				volume,
				status,
				muted,
				setVolume: handleSetVolume,
				toggleMute: handleToggleMute,
				reconnect: handleRequestConnection,
			}}
		>
			{props.children}
		</AudioProviderContext.Provider>
	)
}

export const AudioProviderContext = React.createContext<AudioProviderContext | undefined>(undefined)

export interface AudioProviderContext {
	volume: number
	muted: boolean
	status: Status
	setVolume(volume: number): void
	toggleMute(): void
	reconnect(): void
}
