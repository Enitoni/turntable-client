import type { StrictOmit } from "../core/types"
import { TextInput, type TextInputProps } from "../input/TextInput"
import { type FieldProps, FormField } from "./FormField"

export interface TextFieldProps
	extends FieldProps<string>,
		StrictOmit<TextInputProps, "defaultValue" | "invalid" | "onInput"> {}

export function TextField(props: TextFieldProps) {
	const { field, label, description, className, required, ...rest } = props

	return (
		<FormField
			htmlFor={field.name}
			label={label}
			description={description}
			errors={field.errors}
			className={className}
			required={required}
		>
			<TextInput
				name={field.name}
				invalid={(field.errors?.length || 0) > 0}
				defaultValue={field.initialValue}
				{...rest}
			/>
		</FormField>
	)
}
