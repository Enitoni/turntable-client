import { z } from "zod"

export const loginSchema = z.object({
	username: z.string().trim(),
	password: z.string(),
})

export const registerSchema = z.object({
	username: z.string().trim(),
	displayName: z.string().trim(),
	password: z.string().min(8),
})
