import { twMerge } from "tailwind-merge"

export interface SpinnerProps {
	className?: string
}

export function Spinner(props: SpinnerProps) {
	const className = twMerge("spinner", props.className)

	return <span className={className} />
}
