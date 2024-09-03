export function humanizeSeconds(seconds: number) {
	const isAtLeastAnHour = seconds >= 3600
	const sliceStart = isAtLeastAnHour ? 11 : 14

	return new Date(seconds * 1000).toISOString().slice(sliceStart, 19)
}
