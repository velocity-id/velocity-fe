import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import qs from "qs"
import currencyFormatter from "currency-formatter";

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

export const formatIDR = (value?: string | number) => {
  if (!value) return "";
  return currencyFormatter.format(Number(value), {
    symbol: "",
    decimal: ".",
    thousand: ".",
    precision: 0,
  });
};

