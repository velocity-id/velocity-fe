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
import {
    CheckCircle,
    AlertTriangle,
    Info,
    XCircle,
} from "lucide-react"

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

const iconMap = {
    success: CheckCircle,
    warning: AlertTriangle,
    error: XCircle,
    info: Info,
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
        success: "text-green-600",
        warning: "text-yellow-600",
        error: "text-red-600",
        info: "text-blue-600",
    }

    const Icon = iconMap[type]

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-lg font-semibold">
                        <Icon className={cn("w-5 h-5", colorClasses[type])} />
                        <span>{title}</span>
                    </AlertDialogTitle>

                    {description && (
                        <AlertDialogDescription>{description}</AlertDialogDescription>
                    )}
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
