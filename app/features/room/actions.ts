export const performRoomAction = (roomId: number, action: string) =>
	fetch("/api/room-action", {
		method: "POST",
		body: JSON.stringify({
			roomId,
			action,
		}),
	})

export const seekTo = (roomId: number, to: number) =>
	fetch("/api/room-action", {
		method: "POST",
		body: JSON.stringify({
			roomId,
			action: "seek",
			to,
		}),
	})

export const addToQueue = (roomId: number, url: string) =>
	fetch("/api/queue-submit", {
		method: "POST",
		body: JSON.stringify({
			roomId,
			url,
		}),
	})
