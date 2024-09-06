import { useState } from "react"
import { Button } from "./Button"

export interface AsyncButtonProps extends React.ComponentPropsWithoutRef<"button"> {
	onClick: () => Promise<void>
	onError?: (error: unknown) => void
}

export function AsyncButton(props: AsyncButtonProps) {
	const { children, onClick, onError, ...rest } = props
	const [isPending, setIsPending] = useState(false)

	const disabled = isPending || rest.disabled

	const handleOnClick = () => {
		setIsPending(true)

		onClick()
			.catch((e) => onError?.(e))
			.finally(() => setIsPending(false))
	}

	return <Button {...rest} disabled={disabled} onClick={handleOnClick} />
}
