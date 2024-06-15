import type { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"

export interface ButtonProps extends ComponentProps<"button"> {
	icon?: React.ReactNode
}

export function Button({ icon, children, ...props }: ButtonProps) {
	return (
		<button
			type="button"
			{...props}
			className={twMerge(
				"bg-primary text-white px-4 h-10 font-medium gap-2 flex items-center justify-center rounded-md hover:bg-primary-dark-1 active:bg-primary-dark-2 active:duration-0 active:scale-95 transition will-change-transform tracking-wide shadow",
				props.className,
			)}
		>
			<span className="-m-1 empty:hidden">{icon}</span>
			<span>{children}</span>
		</button>
	)
}
