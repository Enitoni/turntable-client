export interface TextInputProps {
	invalid?: boolean
	defaultValue?: string
	value?: string
	onInput?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
	onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void
	rows?: number
	type?: "text" | "password"
	name?: string
	placeholder?: string
	disabled?: boolean
}

export function TextInput(props: TextInputProps) {
	const { rows = 1, invalid, onInput, onKeyDown, name, ...rest } = props
	const Element = rows > 1 ? "textarea" : "input"

	return (
		<Element
			className="w-full h-10 px-3 leading-none transition border rounded-md outline-none bg-neutral-dark-100 placeholder:text-neutral-content-lighter border-neutral-light-100 hover:border-neutral-border-strong focus-within:outline-secondary disabled:opacity-50"
			onChange={onInput}
			onKeyDown={onKeyDown}
			name={name}
			id={name}
			{...rest}
		/>
	)
}
