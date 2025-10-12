"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"
import { CommonAlertDialog } from "@/components/common/common-alert-dialog"

type AlertType = "success" | "warning" | "error" | "info"

interface AlertContextType {
  showAlert: (
    title: string,
    description: string,
    type?: AlertType,
    confirmText?: string,
    onConfirm?: () => void
  ) => void
}

const AlertContext = createContext<AlertContextType>({
  showAlert: () => {},
})

export function AlertProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<AlertType>("info")
  const [confirmText, setConfirmText] = useState("OK")
  const [onConfirm, setOnConfirm] = useState<(() => void) | undefined>(undefined)

  const showAlert = (
    title: string,
    description: string,
    type: AlertType = "info",
    confirmText = "OK",
    onConfirm?: () => void
  ) => {
    setTitle(title)
    setDescription(description)
    setType(type)
    setConfirmText(confirmText)
    setOnConfirm(() => onConfirm)
    setOpen(true)
  }

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <CommonAlertDialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={description}
        type={type}
        confirmText={confirmText}
        onConfirm={() => {
          if (onConfirm) onConfirm()
          setOpen(false)
        }}
      />
    </AlertContext.Provider>
  )
}

export const useAlert = () => useContext(AlertContext)
