import { ColumnDef } from "@tanstack/react-table"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/select"
import { Button } from "@ui/button"

import { DataTableColumnHeader } from "@components/genericTable/columnHeader"
import { roleService } from "@/_services/role.service"

const changeUserRole = (uid: number, role: string, roleValue: string) => {
  //userService.untrashUser(uid)
  roleService.editUserRoles({ userId: uid, role: role, roleValue: roleValue })
    .then((res: any) => {
      console.log(res)
      //setSubmitState()
    })
    .catch((error: any) => {
      console.log(error)
      //setSubmitState("error")
    })
}

export const ROLE_TABLE_TITLE: { [key: string]: string } = {
  user: "NOM Prénom",
  admin: "Accès complet",
  achats: "Achats",
  inventaire: "Inventaire",
  machines: "Machines",
  contacts: "Contacts",
  calendrier: "Calendrier",
  analytics: "Analytics",
  administratif: "Administratif",
  utilisateurs: "Utilisateurs"
}

let ROLE_TABLE_COLUMNS: ColumnDef<any>[] = [

  /***************** ID *****************/
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="" />
    ),
    cell: ({ row }) => {

      return (
        <div className="">
          #{row.getValue("id")}
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },

  /***************** PEOPLE *****************/
  {
    accessorKey: "user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={ROLE_TABLE_TITLE["user"]} />
    ),
    cell: ({ row }) => {
      return (
        <span className="truncate font-medium">
          {`${row.original["User.familyName"].toUpperCase()} ${row.original["User.name"].charAt(0).toUpperCase() + row.original["User.name"].slice(1)}`}
        </span>
      )
    },
  }

]

/***************** ROLES COLUMNS GENERATIONS *****************/

for (const roleTitle in ROLE_TABLE_TITLE) {

  if (Object.keys(ROLE_TABLE_TITLE).indexOf(roleTitle) !== 0) { // skip USER

    const added: ColumnDef<any> =
    {
      accessorKey: roleTitle,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={ROLE_TABLE_TITLE[roleTitle]} />
      ),
      cell: ({ row }) => {

        let selectedValue = ""

        if (!["r", "w", "rw"].includes(row.getValue(roleTitle))) {
          selectedValue = "null"
        }
        else {
          selectedValue = row.getValue(roleTitle)
        }

        return (
          <span className="truncate font-medium">

            {(row.original.id === 1) ?
              <Button variant="secondary" className="w-full"> ADMIN </Button> :

              <Select
                defaultValue={selectedValue}
                onValueChange={(roleValue) => changeUserRole(row.getValue("id"), roleTitle, roleValue)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder={selectedValue} />
                </SelectTrigger>

                <SelectContent className="w-48">
                  <SelectItem value="null">Aucun</SelectItem>
                  <SelectItem value="r">Lecture</SelectItem>
                  <SelectItem value="w">Ecriture</SelectItem>
                  <SelectItem value="rw">Lect. / Ecr.</SelectItem>
                </SelectContent>
              </Select>
            }

          </span>
        )
      }
    }

    ROLE_TABLE_COLUMNS.push(added)
  }
}

export { ROLE_TABLE_COLUMNS }
