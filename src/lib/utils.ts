import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import qs from "qs"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildQueryParams(params: object) {
  return qs.stringify(params, {
    skipNulls: true,
    encode: true,
    addQueryPrefix: true,
    arrayFormat: "repeat",
  })
}

export async function wait(ms = 5000) {
  await new Promise((r) => setTimeout(r, ms))
}