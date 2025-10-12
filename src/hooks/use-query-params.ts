import { useRouter } from "next/navigation"
import { usePathname, useSearchParams } from "next/navigation"
import qs from "qs"

import { buildQueryParams } from "@/lib/utils"

export default function useQueryParams() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function updateQueryParams(
    updater: (query: qs.ParsedQs) => void,
    replace = false
  ) {
    const query: qs.ParsedQs = qs.parse(searchParams.toString())

    updater(query)

    if (Object.keys(query).length === 0) {
      if (replace) {
        router.replace(pathname)
      } else {
        router.push(pathname)
      }
    } else {
      if (replace) {
        router.replace(buildQueryParams(query))
      } else {
        router.push(buildQueryParams(query))
      }
    }
  }

  return { updateQueryParams }
}
