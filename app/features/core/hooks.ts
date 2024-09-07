import { useState } from "react"
import { clientOnly$ } from "vite-env-only/macros"

const storage = clientOnly$(localStorage)

export const useLocalStorage = <T>(key: string, initialValue: T) => {
	const [storedValue, setStoredValue] = useState<T>(() => {
		const value = storage?.getItem(key) ?? null
		return value ? JSON.parse(value) : initialValue
	})

	const setValue = (value: T) => {
		setStoredValue(value)
		localStorage.setItem(key, JSON.stringify(value))
	}

	return [storedValue, setValue] as const
}
