"use client"

import { DownloadIcon, PlusCircleIcon } from "lucide-react"
import Link from "next/link"

import {
  DataTable,
  DataTableFooter,
  DataTableToolbar,
  DataTableToolbarAction,
  DataTableView,
} from "@/components/common/data-table"

import columns from "./columns"
import RowActions from "./row-actions"
import { UserManagementModel } from "@/features/user-management/type"


interface TableProps {
  data: UserManagementModel[]
  totalItems: number
}

export default function Table({ data, totalItems }: TableProps) {
  return (
    <DataTable>
      <DataTableToolbar>
        <DataTableToolbarAction variant="outline" icon={<DownloadIcon />}>
          Download
        </DataTableToolbarAction>
        <DataTableToolbarAction asChild>
          <Link href="/travel/list/add">
            <PlusCircleIcon /> Tambah
          </Link>
        </DataTableToolbarAction>
      </DataTableToolbar>
      <DataTableView
        columns={columns}
        data={data}
        getItemKey={(item) => item.name}
        rowActions={RowActions}
      />
      <DataTableFooter totalItems={totalItems} />
    </DataTable>
  )
}
