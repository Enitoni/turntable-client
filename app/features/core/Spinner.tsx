export interface SpinnerProps {
	className?: string
}

export function Spinner(props: SpinnerProps) {
	return (
		<div className={props.className}>
			<span className="spinner" />
		</div>
	)
}
