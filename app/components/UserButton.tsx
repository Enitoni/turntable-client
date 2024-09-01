import avatar from "../assets/avatar.jpg"

export function UserButton() {
	return (
		<button type="button" className="border-2 rounded-full border-white/10 size-8 overflow-clip">
			<img src={avatar} alt="Your avatar" className="size-full" />
		</button>
	)
}
