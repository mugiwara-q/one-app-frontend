import { Ellipsis } from "lucide-react"
import { Row } from "@tanstack/react-table"

import { Button } from "@ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableSideRowActions<TData>({
}: DataTableRowActionsProps<TData>) {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <Ellipsis className="h-4 w-4" />
          <span className="sr-only">Ouvrir le menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[160px]">

        <DropdownMenuItem> Modifier </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem> Supprimer </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}
