import type { FormState } from "./ZodForm"

export type FormErrorProps = {
	className?: string
	state: FormState
}

export function FormError(props: FormErrorProps) {
	const { className, state } = props

	if (state.status === "error" && state.errors.length > 0) {
		return (
			<div className={className}>
				<div className="inline-block mb-4 font-medium text-invalid">
					{state.errors.map((error) => (
						<span key={error}>{error}</span>
					))}
				</div>
			</div>
		)
	}

	return <div className={className} />
}
