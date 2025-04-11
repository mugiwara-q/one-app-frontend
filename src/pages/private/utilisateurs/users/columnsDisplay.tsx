import { ColumnDef } from "@tanstack/react-table"

import { DataTableColumnHeader } from "@components/genericTable/columnHeader"

import {
  Ellipsis,
  SquareMinus,
  History,
  Eye,
  Pencil
} from "lucide-react"


import { Button } from "@ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@ui/dropdown-menu"

import { Link } from "react-router-dom"
import { userService } from "@/_services/user.service"
import { accountService } from "@/_services/account.service"

const detailsUserLink = (isEdit: boolean, uid: string): string => {
  return isEdit ?
    "./detailsUser?" + "isEdit=true&id=" + uid :
    "./detailsUser?" + "isEdit=false&id=" + uid
}

const trashItem = (uid: number) => {
  userService.trashOne(uid)
  window.location.reload()
}

const untrashItem = (uid: number) => {
  userService.untrashOne(uid)
  window.location.reload()
}


export const USER_TABLE_TITLE: { [key: string]: string } = {
  name: "Prénom",
  familyName: "Nom de famille",
  email: "E-mail"
  //password: "Mot de passe"
}

const DELETED_STYLE = "text-red-600"

export const USER_TABLE_COLUMNS: ColumnDef<any>[] = [

  /***************** ID *****************/
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="" />
    ),
    cell: ({ row }) => {

      return (
        <div className="">

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex flex-col h-8 w-8 p-0 data-[state=open]:bg-muted"
              >
                #{row.getValue("id")}

                <Ellipsis className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-[160px]">

              {
                (row.original.deletedAt === null) ?
                  <>
                    <DropdownMenuItem>  <Link className="flex" to={detailsUserLink(false, row.getValue("id"))}> <Eye className="mr-4" /> Consulter </Link> </DropdownMenuItem>
                    {(accountService.checkRole("utilisateurs", ["w"])) ?
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem><Link className="flex" to={detailsUserLink(true, row.getValue("id"))}> <Pencil className="mr-4" /> Modifier </Link> </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => trashItem(row.getValue("id"))}> <SquareMinus className="mr-4" /> Supprimer </DropdownMenuItem>
                      </>
                      : <></>
                    }
                  </>
                  :
                  <DropdownMenuItem onClick={() => untrashItem(row.getValue("id"))}> <History className="mr-4" /> Restaurer </DropdownMenuItem>
              }

            </DropdownMenuContent>
          </DropdownMenu>
        </div >
      )
    },
    enableSorting: false,
    enableHiding: false,
  },

  /***************** PRENOM *****************/
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={USER_TABLE_TITLE["name"]} />
    ),
    cell: ({ row }: any) => {
      return (
        <span className={`truncate font-medium ${(row.original.deletedAt === null) ? '' : DELETED_STYLE}`}>
          {row.getValue("name").charAt(0).toUpperCase() + row.original["name"].slice(1)}
        </span>
      )
    },
  },

  /***************** NOM DE FAMILLE *****************/
  {
    accessorKey: "familyName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={USER_TABLE_TITLE["familyName"]} />
    ),
    cell: ({ row }: any) => {
      return (
        <span className={`truncate font-medium ${(row.original.deletedAt === null) ? '' : DELETED_STYLE}`}>
          {row.getValue("familyName").toUpperCase()}
        </span>
      )
    },
  },

  /***************** EMAIL *****************/
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={USER_TABLE_TITLE["email"]} />
    ),
    cell: ({ row }) => {
      return (
        <span className={`truncate font-medium ${(row.original.deletedAt === null) ? '' : DELETED_STYLE}`}>
          {row.getValue("email")}
        </span>
      )
    },
  }

]
