import avatar from "~/assets/avatar.jpg"

export function UserButton() {
	return (
		<button type="button" className="rounded-full border-2 border-white/10 size-8 overflow-clip">
			<img src={avatar} alt="Your avatar" className="size-full" />
		</button>
	)
}
