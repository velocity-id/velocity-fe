import { PencilIcon } from "lucide-react"
import Link from "next/link"

import {
  DataTableRowAction,
  DataTableRowActionSeparator,
  DataTableRowActionsComponent,
  DataTableRowActionsContent,
} from "@/components/common/data-table"

import DeleteAction from "./actions/delete-action"
import { UserManagementModel } from "@/features/user-management/type"

export default function RowActions(
  row: UserManagementModel
): DataTableRowActionsContent {
  function ReturnRowActions(Actions: DataTableRowActionsComponent) {
    return (
      <DeleteAction.Dialog {...row}>
        <Actions>
          <DataTableRowAction asChild>
            <Link href={`/travel/list/edit/${row.name}`}>
              <PencilIcon />
              Edit
            </Link>
          </DataTableRowAction>
          <DataTableRowActionSeparator />
          <DeleteAction.Button />
        </Actions>
      </DeleteAction.Dialog>
    )
  }

  return ReturnRowActions
}
