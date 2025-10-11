"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { CommonLoadingOverlay } from "../components/common/common-loading-overlay"

type LoadingContextType = {
  setLoading: (open: boolean, message?: string) => void
}

const LoadingContext = createContext<LoadingContextType>({
  setLoading: () => {},
})

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("Processing...")

  const setLoading = (open: boolean, msg?: string) => {
    setOpen(open)
    if (msg) setMessage(msg)
  }

  return (
    <LoadingContext.Provider value={{ setLoading }}>
      {children}
      <CommonLoadingOverlay open={open} message={message} />
    </LoadingContext.Provider>
  )
}

export const useLoading = () => useContext(LoadingContext)
