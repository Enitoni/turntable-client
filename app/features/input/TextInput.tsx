export interface TextInputProps {
	invalid?: boolean
	defaultValue?: string
	onInput?: (event: React.ChangeEvent) => void
	rows?: number
	type?: "text" | "password"
	name?: string
	placeholder?: string
}

export function TextInput(props: TextInputProps) {
	const { rows = 1, invalid, onInput, name, ...rest } = props
	const Element = rows > 1 ? "textarea" : "input"

	return (
		<Element
			className="w-full h-10 px-3 leading-none transition border rounded-md outline-none bg-neutral-dark-100 placeholder:text-neutral-content-lighter border-neutral-light-100 hover:border-neutral-border-strong focus-within:outline-secondary"
			onChange={onInput}
			name={name}
			id={name}
			{...rest}
		/>
	)
}
