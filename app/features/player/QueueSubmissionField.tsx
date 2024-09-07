import { useState } from "react"
import { TextInput } from "../input/TextInput"

export interface QueueSubmissionFieldProps {
	roomId: number
}

export function QueueSubmissionField(props: QueueSubmissionFieldProps) {
	const { roomId } = props

	const [input, setInput] = useState("")
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleSubmit = (event: React.KeyboardEvent) => {
		if (event.key === "Enter") {
			event.preventDefault()

			if (input.length === 0) {
				return
			}

			setIsSubmitting(true)

			fetch("/api/queue-submit", {
				method: "POST",
				body: JSON.stringify({
					roomId: roomId,
					url: input,
				}),
			})
				.then((response) => {
					if (response.ok) {
						setInput("")
					}
				})
				.finally(() => setIsSubmitting(false))
		}
	}

	return (
		<TextInput
			placeholder="Paste a link to add to queue"
			value={input}
			disabled={isSubmitting}
			onInput={(event) => setInput(event.target.value)}
			onKeyDown={handleSubmit}
		/>
	)
}
