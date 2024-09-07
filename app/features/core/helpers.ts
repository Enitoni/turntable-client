import type { ServerRuntimeMetaDescriptor } from "@remix-run/server-runtime"

export function humanizeSeconds(seconds: number) {
	const isAtLeastAnHour = seconds >= 3600
	const sliceStart = isAtLeastAnHour ? 11 : 14

	return new Date(seconds * 1000).toISOString().slice(sliceStart, 19)
}

interface MetaOptions {
	title: string
	description: string
}

export const createMeta = (options: MetaOptions): ServerRuntimeMetaDescriptor[] => [
	{ title: `${options.title} | turntable` },
	{ name: "description", content: options.description },
	{ name: "theme-color", content: "#A845E4" },
]
