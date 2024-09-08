import containerQueries from "@tailwindcss/container-queries"
import { darken } from "polished"
import defaultTheme from "tailwindcss/defaultTheme.js"

const colors = {
	primary: "#A845E4",
	secondary: "#5471FF",
	darkish: "#0A141D",
	darkest: "#060A0E",
	golden: "#FFBF1C",
	invalid: "#EA3757",
	success: "#29CA60",
}

const neutralLights = {
	100: "rgba(255, 255, 255, 0.1)",
	200: "rgba(255, 255, 255, 0.2)",
	500: "rgba(255, 255, 255, 0.5)",
}

const neutralDarks = {
	100: "rgba(0, 0, 0, 0.2)",
}

/** @satisfies {import("tailwindcss").Config} */
export default {
	content: ["./app/**/*.{js,jsx,ts,tsx}"],
	theme: {
		fontFamily: {
			sans: ["Lato", ...defaultTheme.fontFamily.sans],
			display: ["Kufam Variable", ...defaultTheme.fontFamily.sans],
		},
		boxShadow: {
			sm: "2px 2px 7px -1px rgba(0, 0, 0, 0.13)",
			button: "4px 4px 10px 0 rgba(0, 0, 0, 0.15)",
			DEFAULT: "4px 4px 10px 0 rgba(0, 0, 0, 0.1)",
		},
		extend: {
			backgroundImage: {
				"gradient-angled": "linear-gradient(20deg, var(--tw-gradient-stops))",
			},
			colors: {
				...colors,
				neutral: {
					light: neutralLights,
					dark: neutralDarks,
				},
				"primary-dark-1": darken(0.12, colors.primary),
				"primary-dark-2": darken(0.24, colors.primary),
			},
		},
	},
	plugins: [containerQueries],
}
