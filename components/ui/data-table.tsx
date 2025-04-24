"\"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

interface DataTableProps extends React.HTMLAttributes<HTMLTableElement> {
  columns: { key: string; header: string }[]
  rows: any[]
}

export function DataTable({ columns, rows, className, ...props }: DataTableProps) {
  return (
    <table className={cn("w-full border-collapse", className)} {...props}>
      <thead>
        <tr className="border-b">
          {columns.map((column) => (
            <th key={column.key} className="text-left p-2">
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id} className="border-b">
            {columns.map((column) => (
              <td key={column.key} className="p-2">
                {row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
