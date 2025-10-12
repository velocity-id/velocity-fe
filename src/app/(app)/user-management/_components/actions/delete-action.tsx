import { Trash2Icon } from "lucide-react"
import { useState, useTransition } from "react"

import { DataTableRowAction } from "@/components/common/data-table"
import LoadingIcon from "@/components/common/loading-icon"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { buttonVariants } from "@/components/ui/button"
import { wait } from "@/lib/utils"
import { UserManagementModel } from "@/features/user-management/type"

function Dialog({ name, children }: React.PropsWithChildren<UserManagementModel>) {
  const [pending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {children}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Anda akan menghapus <strong>{name}</strong> dari daftar travel.
            Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>

          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={(e) => {
              e.preventDefault()

              startTransition(async () => {
                await wait()
                setOpen(false)
              })
            }}
            disabled={pending}>
            <LoadingIcon loading={pending}>
              <Trash2Icon size={16} aria-hidden="true" />
            </LoadingIcon>
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function Button() {
  return (
    <AlertDialogTrigger asChild>
      <DataTableRowAction variant="destructive">
        <Trash2Icon size={16} aria-hidden="true" />
        Hapus
      </DataTableRowAction>
    </AlertDialogTrigger>
  )
}

const DeleteAction = { Dialog, Button }

export default DeleteAction
