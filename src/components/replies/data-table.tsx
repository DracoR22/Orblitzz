'use client'

import { useState } from "react"
import { ColumnDef, ColumnFiltersState, SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { useSession } from "next-auth/react"
import { Skeleton } from "../ui/skeleton"
import { Input } from "../ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Button } from "../ui/button"
import { trpc } from "@/server/trpc/client"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  projectId: string
}

export function DataTable<TData, TValue>({ columns, projectId }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const { data, isPending } = trpc.reddit.getProjectReplies.useQuery({ projectId })

  const table = useReactTable({
    // @ts-ignore
    data,
    // @ts-ignore
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  const [isRefreshing, setIsRefreshing] = useState(false)

  if (isPending) {
    return (
      <>
       <div className="mt-10 flex items-center justify-between mb-2">
        <Skeleton className="h-10 w-[400px]" />
       </div>

       <div className="mt-4">
         <Skeleton className="w-full h-[300px]"/>
       </div>
      </>
    )
  }

  return (
    <div>
        <div className="flex items-center py-4 justify-between">
        <Input placeholder="Filter posts..." value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event: any) => table.getColumn("title")?.setFilterValue(event.target.value)} className="max-w-sm dark:bg-neutral-800" />
       </div>
    <div className="rounded-md border dark:bg-neutral-800">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-neutral-600">
                No replies yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    <div className="flex items-center justify-end space-x-2 py-4">
        <Button className="dark:bg-[#1e1e1e]" variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button className="dark:bg-[#1e1e1e]" variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  )
}