import * as Slider from "@radix-ui/react-slider"
import { useState } from "react"

export interface SliderInputProps {
	value?: number
	disabled?: boolean
	onValueChange?: (value: number) => void
	onValueCommit?: (value: number) => void
}

export function SliderInput(props: SliderInputProps) {
	const { value, disabled } = props

	const unNormalizedValue = value ? value * SLIDER_DEFAULT_MAX : undefined

	const [isDragging, setIsDragging] = useState(false)
	const [draggedValue, setDraggedValue] = useState(0)

	const usedValue = isDragging ? draggedValue : unNormalizedValue

	return (
		<Slider.Root
			disabled={disabled}
			className="relative flex w-full py-2 cursor-pointer"
			onValueChange={(a) => {
				const value = a[0] as number

				setDraggedValue(a[0] as number)
				setIsDragging(true)

				props.onValueChange?.(value / SLIDER_DEFAULT_MAX)
			}}
			onValueCommit={(a) => {
				const value = a[0] as number

				setIsDragging(false)
				props.onValueCommit?.(value / SLIDER_DEFAULT_MAX)
			}}
			value={usedValue ? [usedValue] : undefined}
			max={SLIDER_DEFAULT_MAX}
		>
			<Slider.Track className="relative w-full h-1 overflow-hidden rounded-full bg-neutral-light-100">
				<Slider.Range className="absolute block h-full rounded-full bg-primary" />
			</Slider.Track>
			<Slider.Thumb className="block bg-primary rounded-full size-3  mt-[-0.25rem]" />
		</Slider.Root>
	)
}

const SLIDER_DEFAULT_MAX = 9000000
