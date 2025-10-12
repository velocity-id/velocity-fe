"use client"

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  Loader2Icon,
  LucideProps,
  MoreVerticalIcon,
  XIcon,
} from "lucide-react"
import { useSearchParams } from "next/navigation"
import React, {
  createContext,
  isValidElement,
  useContext,
  useId,
  useState,
} from "react"

import { setPageSize } from "@/actions"
import { useAppContext } from "@/app/(app)/_providers/app-provider"
import useQueryParams from "@/hooks/use-query-params"
import { cn } from "@/lib/utils"

import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import LoadingIcon from "./loading-icon"

type TDataType = Record<
  string,
  string | number | boolean | object | null | unknown
>

export type DataTableColumn<TData extends TDataType> = {
  key: (keyof TData & string) | (string & {})
  label: React.ReactNode
  render?: (data: TData) => React.ReactNode
  className?: string
}

interface DataTableProps extends React.PropsWithChildren {
  className?: string
}

export function DataTable({ children, className }: DataTableProps) {
  return <div className={cn("max-w-full space-y-4", className)}>{children}</div>
}

export type DataTableRowActionsComponent =
  React.ComponentType<React.PropsWithChildren>

export type DataTableRowActionsContent =
  | React.ReactNode
  | ((Actions: DataTableRowActionsComponent) => React.ReactNode)

type DataTableRowActionsRenderer<TData extends TDataType> = (
  row: TData
) => DataTableRowActionsContent

interface DataTableViewProps<TData extends TDataType> {
  getItemKey?: (item: TData, idx: number) => string
  columns?: DataTableColumn<TData>[]
  data?: TData[]
  rowActions?: DataTableRowActionsRenderer<TData>
  className?: string
}

export function DataTableView<TData extends TDataType>({
  getItemKey = (_item, i) => `row-${i}`,
  columns = [],
  data = [],
  rowActions,
  className,
}: DataTableViewProps<TData>) {
  const rowId = useId()

  return (
    <div className={cn("overflow-hidden rounded-lg border", className)}>
      <Table className="h-full">
        <TableHeader className="bg-muted sticky top-0 z-10">
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.label}</TableHead>
            ))}
            {rowActions ? (
              <TableHead className="w-[48px] min-w-[48px]">
                <span className="sr-only">Aksi</span>
              </TableHead>
            ) : null}
          </TableRow>
        </TableHeader>
        <TableBody className="h-full **:data-[slot=table-cell]:first:w-8">
          {data.length > 0 ? (
            data.map((item, i) => (
              <TableRow
                key={`${rowId}-${getItemKey(item, i)}`}
                className="h-full">
                {columns.map((column) => {
                  const itemKey = column.key
                  const itemValue = column.render?.(item) || item[itemKey]

                  return (
                    <TableCell key={itemKey} className={cn(column.className)}>
                      {itemValue != null &&
                      (typeof itemValue === "string" ||
                        typeof itemValue === "number" ||
                        isValidElement(itemValue)) ? (
                        itemValue
                      ) : (
                        <span className="text-muted-foreground/80">-</span>
                      )}
                    </TableCell>
                  )
                })}

                {rowActions ? (
                  <TableCell
                    key="__actions"
                    className="bg-muted sticky right-0 flex h-full items-center justify-center border-l">
                    <DataTableRowActions>
                      {rowActions(item)}
                    </DataTableRowActions>
                  </TableCell>
                ) : null}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + 2}
                className="h-128 text-center">
                Data tidak ditemukan.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

const DataTableToolbarActionContext = createContext<{
  mode: "button" | "dropdown"
  onClose: () => void
}>({
  mode: "button",
  onClose: () => {},
})

function DataTableToolbarActionProvider({
  mode,
  onClose,
  children,
}: React.PropsWithChildren<{
  mode: "button" | "dropdown"
  onClose: () => void
}>) {
  return (
    <DataTableToolbarActionContext.Provider value={{ mode, onClose }}>
      {children}
    </DataTableToolbarActionContext.Provider>
  )
}

interface DataTableToolbarProps {
  className?: string
  children?: DataTableRowActionsContent
}

export function DataTableToolbar({
  className,
  children,
}: DataTableToolbarProps) {
  const [open, setOpen] = useState(false)

  const searchParams = useSearchParams()
  const { updateQueryParams } = useQueryParams()

  const q = searchParams.get("q")

  const Content = ({ children }: React.PropsWithChildren) => (
    <>
      <div className="hidden flex-row gap-2 lg:flex">
        <DataTableToolbarActionProvider
          mode="button"
          onClose={() => void setOpen(false)}>
          {children}
        </DataTableToolbarActionProvider>
      </div>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button className="size-8 lg:hidden" variant="outline" size="icon">
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="lg:hidden" align="end">
          <DataTableToolbarActionProvider
            mode="dropdown"
            onClose={() => void setOpen(false)}>
            {children}
          </DataTableToolbarActionProvider>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <form
        action={(formData) => {
          updateQueryParams((query) => {
            const q = formData.get("q")
            if (typeof q === "string") {
              if (q) query.q = q
              else delete query.q
            } else {
              delete query.q
            }
            delete query.page
          })
        }}
        className="flex flex-1 flex-row gap-2">
        <Input
          id="q"
          name="q"
          autoComplete="on"
          autoSave="on"
          placeholder="Pencarian..."
          defaultValue={q || undefined}
          className="h-8 w-full max-w-xs"
        />
        {q ? (
          <Button
            type="button"
            variant="ghost"
            // onClick={() => table.resetColumnFilters()}
            onClick={() => {
              updateQueryParams((query) => {
                delete query.q
              })
            }}
            className="h-8 px-2 lg:px-3">
            Reset
            <XIcon />
          </Button>
        ) : null}
      </form>

      {children ? (
        typeof children === "function" ? (
          <>{children(Content)}</>
        ) : (
          <>
            <div className="hidden flex-row gap-2 lg:flex">
              <DataTableToolbarActionProvider
                mode="button"
                onClose={() => void setOpen(false)}>
                {children}
              </DataTableToolbarActionProvider>
            </div>
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  className="size-8 lg:hidden"
                  variant="outline"
                  size="icon">
                  <MoreVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="lg:hidden" align="end">
                <DataTableToolbarActionProvider
                  mode="dropdown"
                  onClose={() => void setOpen(false)}>
                  {children}
                </DataTableToolbarActionProvider>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )
      ) : null}
    </div>
  )
}

interface DataTableToolbarActionProps {
  variant?: "default" | "outline"
  icon?: React.ReactElement<LucideProps>
  asChild?: boolean
  className?: string
  disabled?: boolean
  loading?: boolean
  onClick?: (args: { onClose: () => void }) => void
  manualClose?: boolean
}

export function DataTableToolbarAction({
  variant,
  icon,
  asChild,
  className,
  disabled,
  loading,
  onClick,
  manualClose,
  children,
}: React.PropsWithChildren<DataTableToolbarActionProps>) {
  const { mode, onClose } = useContext(DataTableToolbarActionContext)

  if (mode === "dropdown") {
    return (
      <DropdownMenuItem
        disabled={disabled || loading}
        onClick={(e) => {
          if (manualClose) {
            e.preventDefault()
          }
          onClick?.({ onClose })
        }}
        asChild={asChild}>
        {asChild ? (
          children
        ) : (
          <>
            <LoadingIcon loading={loading}>{icon}</LoadingIcon>
            {children}
          </>
        )}
      </DropdownMenuItem>
    )
  }

  return (
    <Button
      className={cn("h-8", className)}
      variant={variant}
      disabled={disabled || loading}
      onClick={() => {
        onClick?.({ onClose })
      }}
      asChild={asChild}>
      {asChild ? (
        children
      ) : (
        <>
          {loading ? <Loader2Icon className="animate-spin" /> : icon}
          {children}
        </>
      )}
    </Button>
  )
}

const DataTableRowActionContext = createContext<{
  onClose: () => void
}>({
  onClose: () => {},
})

function DataTableRowActionProvider({
  onClose,
  children,
}: React.PropsWithChildren<{ onClose: () => void }>) {
  return (
    <DataTableRowActionContext.Provider value={{ onClose }}>
      {children}
    </DataTableRowActionContext.Provider>
  )
}

interface DataTableRowActionsProps {
  children?: DataTableRowActionsContent
}

function DataTableRowActions({ children }: DataTableRowActionsProps) {
  const [open, setOpen] = useState(false)

  const Content = ({ children }: React.PropsWithChildren) => (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="size-8" variant="ghost" size="icon">
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DataTableRowActionProvider onClose={() => void setOpen(false)}>
          {children}
        </DataTableRowActionProvider>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  if (typeof children === "function") {
    return <>{children(Content)}</>
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="size-8" variant="ghost" size="icon">
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DataTableRowActionProvider onClose={() => void setOpen(false)}>
          {children}
        </DataTableRowActionProvider>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface DataTableRowActionProps {
  variant?: "default" | "destructive"
  icon?: React.ReactElement<LucideProps>
  asChild?: boolean
  disabled?: boolean
  loading?: boolean
  onClick?: (args: { onClose: () => void }) => void
  manualClose?: boolean
}

export function DataTableRowAction({
  variant,
  icon,
  asChild,
  disabled,
  loading,
  onClick,
  manualClose = false,
  children,
}: React.PropsWithChildren<DataTableRowActionProps>) {
  const { onClose } = useContext(DataTableRowActionContext)

  return (
    <DropdownMenuItem
      variant={variant}
      disabled={disabled || loading}
      onClick={(e) => {
        if (manualClose) e.preventDefault()
        onClick?.({ onClose })
      }}
      asChild={asChild}>
      {asChild ? (
        children
      ) : (
        <>
          <LoadingIcon loading={loading}>{icon}</LoadingIcon>
          {children}
        </>
      )}
    </DropdownMenuItem>
  )
}

export const DataTableRowActionSeparator = DropdownMenuSeparator

interface DataTableFooterProps {
  totalItems?: number
}

export function DataTableFooter({ totalItems }: DataTableFooterProps) {
  const rowsPerPageId = useId()

  const searchParams = useSearchParams()
  const { updateQueryParams } = useQueryParams()

  const { pageSize: size } = useAppContext()
  const currentPage = searchParams.get("page")
    ? parseInt(searchParams.get("page") || "1")
    : 1
  const totalPages = totalItems ? Math.ceil(totalItems / size) : 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Label htmlFor={rowsPerPageId} className="max-sm:sr-only">
          Baris per halaman
        </Label>
        <Select
          value={`${size}`}
          onValueChange={async (value) => {
            updateQueryParams((query) => {
              query.size = value
            })
            await setPageSize(+value)
          }}>
          <SelectTrigger
            id={rowsPerPageId}
            className="h-8 w-fit whitespace-nowrap">
            <SelectValue placeholder="Select number of results" />
          </SelectTrigger>
          <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
            {[5, 10, 25, 50, 100].map((pageSize) => (
              <SelectItem key={pageSize} value={pageSize.toString()}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          {totalItems ? Math.min((currentPage - 1) * size + 1, totalItems) : 0}-
          {totalItems ? Math.min(currentPage * size, totalItems) : 0} dari{" "}
          {totalItems ?? 0}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              updateQueryParams((query) => {
                query.page = "1"
              })
            }}
            disabled={currentPage <= 1}>
            <span className="sr-only">Go to first page</span>
            <ChevronsLeftIcon />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              updateQueryParams((query) => {
                query.page = `${currentPage - 1}`
              })
            }}
            disabled={currentPage <= 1}>
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              updateQueryParams((query) => {
                query.page = `${currentPage + 1}`
              })
            }}
            disabled={currentPage >= totalPages}>
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              updateQueryParams((query) => {
                query.page = `${totalPages}`
              })
            }}
            disabled={currentPage >= totalPages}>
            <span className="sr-only">Go to last page</span>
            <ChevronsRightIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
