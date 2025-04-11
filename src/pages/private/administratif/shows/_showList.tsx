// ui imports
import { Button } from "@ui/button"
import { Input } from "@ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@ui/dropdown-menu"

import {
  SquarePlus,
  SquareMinus,
  History,
  Eye,
  Pencil
} from "lucide-react"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

import { accountService } from "@/_services/account.service"
import { showService } from "@/_services/show.service"

export default function ShowList() {

  /***************** STATE VARIABLES *****************/
  const [displayList, setDisplayList] = useState([])
  const [displayListFiltered, setDisplayListFiltered] = useState([])
  const [displayFilter, setDisplayFilter] = useState("")
  const DELETED_STYLE = "text-red-600"

  /***************** SERVICES *****************/
  useEffect(() => {
    showService.getAll()
      .then(res => {
        setDisplayList(res.data.data)
        setDisplayListFiltered(res.data.data)
      })
      .catch(e => console.log(e))
  }, [])

  /***************** FILTER SHOWS FROM INPUTS *****************/
  function onChangeFilter(e: any) {
    setDisplayFilter(e.target.value)

    if (e.target.value === "") {
      setDisplayListFiltered(displayList)
    }

    else {
      setDisplayListFiltered(displayList.filter((o: any) =>
        o.name.includes(e.target.value.toLowerCase())))
    }
  }

  /***************** LINKS *****************/
  let navigate = useNavigate()
  function addLink() {
    navigate("./detailsShow")
  }

  function detailsLink(isEdit: boolean, uid: string): string {
    return isEdit ?
      "./detailsShow?" + "isEdit=true&id=" + uid :
      "./detailsShow?" + "isEdit=false&id=" + uid
  }

  function trashItem(uid: number) {
    showService.trashOne(uid)
    window.location.reload()
  }

  function untrashItem(uid: number) {
    showService.untrashOne(uid)
    window.location.reload()
  }

  /***************** RENDER FUNCTION *****************/

  function renderItemList(displayList: any): React.ReactElement[] {

    const element: React.ReactElement[] = []

    if (displayList.length > 0) {
      displayList.map((item: any) => {
        element.push(
          <div key={item.id} className="flex flex-1 p-4 mb-4 rounded-lg border border-dashed">

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <h3 className={`text-2xl font-bold tracking-tight ${(item.deletedAt === null) ? '' : DELETED_STYLE}`}>
                  {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                </h3>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-[160px]">

                {
                  (item.deletedAt === null) ?
                    <>
                      <DropdownMenuItem>  <Link className="flex" to={detailsLink(false, item.id)}> <Eye className="mr-4" /> Consulter </Link> </DropdownMenuItem>
                      {(accountService.checkRole("utilisateurs", ["w"])) ?
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem><Link className="flex" to={detailsLink(true, item.id)}> <Pencil className="mr-4" /> Modifier </Link> </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => trashItem(item.id)}> <SquareMinus className="mr-4" /> Supprimer </DropdownMenuItem>
                        </>
                        : <></>
                      }
                    </>
                    :
                    <DropdownMenuItem onClick={() => untrashItem(item.id)}> <History className="mr-4" /> Restaurer </DropdownMenuItem>
                }

              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        )
      })
    }

    else { element.push(<div key="0" className="flex flex-1 p-4 mb-4 rounded-lg border border-dashed">Aucun spectacle pour le moment !</div>) }
    return element

  }

  /***************** RETURN FUNCTION *****************/

  return (
    <>
      <div className="flex pb-4">
        <Input className="flex flex-col mr-5 py-4 items-center w-2/3 "
          placeholder="Rechercher ..."
          value={displayFilter}
          onChange={onChangeFilter}
        />
        <div className="flex flex-col items-center text-center w-1/2">
          <Button className="flex items-center text-center w-full" onClick={() => addLink()}> <SquarePlus className="mr-2" /> Nouveau spectacle </Button>
        </div>
      </div>

      <div className="overflow-hidden bg-background shadow h-full flex-1 flex-col space-y-8 md:flex">
        {/*<UsersDataTable data={users} columns={USER_TABLE_COLUMNS} head={USER_TABLE_TITLE} />*/}
      </div>

      {renderItemList(displayListFiltered)}

    </>
  )
}