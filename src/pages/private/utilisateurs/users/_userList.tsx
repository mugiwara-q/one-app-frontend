import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { userService } from "@/_services/user.service"

import { UsersDataTable } from "./dataTable"
import { USER_TABLE_TITLE } from "./columnsDisplay"
import { USER_TABLE_COLUMNS } from "./columnsDisplay"

import { Button } from "@ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card"

import {
  Activity,
  Trash2,
  SquarePlus,
} from "lucide-react"


export default function UserList() {

  /***************** STATE VARIABLES *****************/
  const [users, setUsers] = useState([])

  const [usersCount, setUsersCount] = useState(0)
  const [deletedUsersCount, setDeletedUsers] = useState(0)

  /***************** USER SERVICES *****************/
  useEffect(() => {
    userService.getAll()
      .then(res => {
        setUsers(res.data.data)
      })
      .catch(e => console.log(e))

    userService.getTrashCount()
      .then(res => {
        setDeletedUsers(res.data.data)
        console.log(res.data.data)
      })
      .catch(e => console.log(e))

    userService.getActiveCount()
      .then(res => {
        setUsersCount(res.data.data)
      })
      .catch(e => console.log(e))

  }, [])

  /***************** ADD USER LINK *****************/
  let navigate = useNavigate()
  const addUserLink = () => {
    navigate("./detailsUser") //navigate("?XX=x")
  }

  return (
    <>
      <div className="flex flex-1 flex-col grid-cols-2 gap-4 grid md:gap-8">

        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nombre d'utilisateurs actifs
            </CardTitle>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersCount}</div>
          </CardContent>
        </Card>

        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Utilisateurs supprimés
            </CardTitle>
            <Trash2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deletedUsersCount}</div>
          </CardContent>
        </Card>

      </div>

      <div className="flex flex-1 flex-col grid-cols-1 grid">
        <Button onClick={() => addUserLink()}>
          <SquarePlus className="mr-1" />
          Ajouter un utilisateur
        </Button>
      </div>

      <div className="overflow-hidden bg-background shadow h-full flex-1 flex-col space-y-8 md:flex">
        <UsersDataTable data={users} columns={USER_TABLE_COLUMNS} head={USER_TABLE_TITLE} />
      </div>
    </>
  )

}