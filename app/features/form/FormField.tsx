import type { FieldMetadata } from "@conform-to/react"
import type { PropsWithChildren } from "react"
import { twMerge } from "tailwind-merge"

export type FormFieldProps = PropsWithChildren<{
	htmlFor: string
	label: string
	description?: string
	className?: string
	required?: boolean
	errors?: string[]
}>

export interface FieldProps<T> {
	field: FieldMetadata<T>
	className?: string
	required?: boolean
	label: string
	description?: string
}

export function FormField(props: FormFieldProps) {
	const { htmlFor, label, description, className, children, errors, required } = props

	const mergedClassName = twMerge("flex-1", className)

	return (
		<div className={mergedClassName}>
			<label className="label" htmlFor={htmlFor}>
				{label}
				{required && <span className="text-semantic-negative"> *</span>}
			</label>
			{children}
			{description && <p className="mt-2 text-sm text-neutral-content-light">{description}</p>}
			{errors?.map((error, index) => (
				<span
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					key={index}
					className="inline-block mt-2 text-sm italic font-medium text-semantic-negative"
				>
					{error}
				</span>
			))}
		</div>
	)
}
