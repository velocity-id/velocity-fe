"use server"

import { cookies } from "next/headers"

export async function setPageSize(size: number) {
  const cookieStore = await cookies()

  cookieStore.set("velocity_page_size", `${size}`)
}
