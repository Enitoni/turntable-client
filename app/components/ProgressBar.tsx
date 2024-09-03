export interface ProgressBarProps {
	progress: number
}

export function ProgressBar(props: ProgressBarProps) {
	const { progress } = props

	return (
		<div className="relative w-full h-1 overflow-hidden rounded-full bg-neutral-light-100">
			<div
				className="absolute top-0 bottom-0 left-0 right-0 origin-left rounded-full bg-primary"
				style={{ transform: `scaleX(${progress})` }}
			/>
		</div>
	)
}
