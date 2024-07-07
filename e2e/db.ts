import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

const client = postgres("postgresql://turntable:turntable@localhost:5432/turntable")
export const testDb = drizzle(client)
