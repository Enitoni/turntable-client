import { useNavigation } from "@remix-run/react"

export function Button(props: React.ComponentPropsWithoutRef<"button">) {
	const { children, ...rest } = props
	const navigation = useNavigation()

	const disabled = rest.disabled || navigation.state !== "idle"

	return (
		<button {...rest} type={rest.type ?? "button"} disabled={disabled}>
			{children}
		</button>
	)
}
