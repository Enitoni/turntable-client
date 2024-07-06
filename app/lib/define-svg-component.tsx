import React from "react"

export function defineSvgComponent(name: string, element: React.ReactElement) {
	function Component(props: React.SVGProps<SVGSVGElement>) {
		return React.cloneElement(element, props)
	}
	Component.displayName = name
	return Component
}
