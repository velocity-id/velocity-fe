"use client"

import { Loader2 } from "lucide-react"

interface CommonLoadingOverlayProps {
  open: boolean
  message?: string
}

export function CommonLoadingOverlay({ open, message = "Processing..." }: CommonLoadingOverlayProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-3 bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>
      </div>
    </div>
  )
}
