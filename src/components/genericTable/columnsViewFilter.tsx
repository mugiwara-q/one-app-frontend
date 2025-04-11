import { SlidersHorizontal } from "lucide-react"
import { Table } from "@tanstack/react-table"

import { Button } from "@ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@ui/dropdown-menu"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>,
  head: { [key: string]: string }
}

export function DataTableViewOptions<TData>(
  {
    table,
    head
  }: DataTableViewOptionsProps<TData>) {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8 lg:flex" >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Afficher ...
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Colonnes :</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className=""
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {head[column.id]}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}