"use client"

import * as React from "react"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

type AlertType = "success" | "warning" | "error" | "info"

interface CommonAlertDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title?: string
    description?: string
    type?: AlertType
    confirmText?: string
    onConfirm?: () => void
}

export function CommonAlertDialog({
    open,
    onOpenChange,
    title = "Notification",
    description,
    type = "info",
    confirmText = "OK",
    onConfirm,
}: CommonAlertDialogProps) {
    const colorClasses = {
        success: "border-green-500 text-green-600",
        warning: "border-yellow-500 text-yellow-600",
        error: "border-red-500 text-red-600",
        info: "border-blue-500 text-blue-600",
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle
                        className={cn(
                            "text-lg font-semibold border-l-4 pl-3",
                            colorClasses[type]
                        )}
                    >
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction
                        className={cn(
                            "text-white",
                            type === "success" && "bg-green-600 hover:bg-green-700",
                            type === "warning" && "bg-yellow-500 hover:bg-yellow-600",
                            type === "error" && "bg-red-600 hover:bg-red-700",
                            type === "info" && "bg-blue-600 hover:bg-blue-700"
                        )}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
