import React from "react"
import { twMerge } from "tailwind-merge"
import { Button } from "../../components/Button"
import { Spinner } from "../core/Spinner"
import type { FormState } from "./ZodForm"

export interface FormButtonProps {
	state: FormState
	iconSlot?: JSX.Element
	className?: string
	label: string
}

export function FormButton(props: FormButtonProps) {
	const { state, iconSlot, className, label } = props

	const loading = state.status === "pending"

	const renderIcon = () => {
		if (loading) {
			return <Spinner className="size-5" />
		}

		if (iconSlot) {
			const clonedIcon = React.cloneElement(iconSlot, {
				className: "icon",
			})

			return clonedIcon
		}

		return null
	}

	const mergedClassNames = twMerge(className, "flex")

	return (
		<Button type="submit" disabled={loading} className={mergedClassNames}>
			{renderIcon()}
			{label}
		</Button>
	)
}
