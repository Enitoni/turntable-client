import { Check, X } from "lucide-react"
import { useRef, useState } from "react"
import { twMerge } from "tailwind-merge"
import { Spinner } from "../core/Spinner"
import { TextInput } from "../input/TextInput"
import { addToQueue } from "../room/actions"

export interface QueueSubmissionFieldProps {
	roomId: number
}

export function QueueSubmissionField(props: QueueSubmissionFieldProps) {
	const { roomId } = props

	const [input, setInput] = useState("")

	const timerRef = useRef(0)
	const [status, setStatus] = useState<"idle" | "submitting" | "error" | "success">("idle")
	const [isShown, setIsShown] = useState(false)
	const [error, setError] = useState("")

	const handleSubmit = (event: React.KeyboardEvent) => {
		if (event.key === "Enter") {
			event.preventDefault()

			clearTimeout(timerRef.current)

			if (input.length === 0) {
				return
			}

			setStatus("submitting")
			setIsShown(true)

			submit().finally(() => {
				timerRef.current = window.setTimeout(() => {
					setIsShown(false)
				}, 5000)
			})
		}
	}

	const submit = async () => {
		const response = await addToQueue(roomId, input)
		const json = await response.json()

		if (response.ok) {
			setInput("")
			setStatus("success")
		} else {
			setStatus("error")
			setError(json.message)
		}
	}

	const renderStatus = () => {
		if (status === "error") {
			return (
				<div className="flex items-center h-full gap-2 text-invalid">
					<X />
					<span className="-mt-0.5">{error}</span>
				</div>
			)
		}

		if (status === "success") {
			return (
				<div className="flex items-center h-full gap-2 text-success">
					<Check />
					<span className="-mt-0.5">Added successfully</span>
				</div>
			)
		}

		return (
			<div className="flex items-center h-full gap-4">
				<Spinner className="size-4" />
				<span className="-mt-0.5">Submitting...</span>
			</div>
		)
	}

	return (
		<div className="relative w-full">
			<div
				className={twMerge(
					"absolute h-12 top-[-92px] left-0 card px-4 transition translate-y-2 opacity-0",
					isShown && "translate-y-0 opacity-100",
				)}
			>
				<div className="absolute top-[47px] ">
					<div className="triangle-down" />
				</div>
				{renderStatus()}
			</div>
			<TextInput
				placeholder="Paste a link to add to queue"
				value={input}
				disabled={status === "submitting"}
				onInput={(event) => setInput(event.target.value)}
				onKeyDown={handleSubmit}
			/>
		</div>
	)
}
