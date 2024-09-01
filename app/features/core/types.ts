export type StrictOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : T
