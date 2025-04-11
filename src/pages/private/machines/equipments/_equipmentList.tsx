// ui imports
import { Button } from "@ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card"
import { Input } from "@ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@ui/dropdown-menu"

import {
  Activity,
  CircleAlert,
  CircleCheck,
  SquarePlus,
  SquareMinus,
  History,
  Eye,
  Pencil
} from "lucide-react"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

import { UpperFirstLetter } from "@utils/helpers"

import { accountService } from "@/_services/account.service"
import { vehicleService } from "@/_services/vehicle.service"

export default function EquipmentList() {

  /***************** STATE VARIABLES *****************/
  const [displayList, setDisplayList] = useState([])
  const [displayListFiltered, setDisplayListFiltered] = useState([])
  const [displayFilter, setDisplayFilter] = useState("")
  const DELETED_STYLE = "text-red-600"
  const MACHINE_CATEGORY = "equipement"

  const [vehiclesCount, setVehiclesCount] = useState(0)
  const [issuesCount] = useState("?")
  const [resolvedIssuesCount] = useState("?")
  const [inspectionDateMonthsLimit, setInspectionMonthsDateLimit] = useState(0)

  /***************** SERVICES *****************/
  useEffect(() => {

    vehicleService.getInspectionDateLimitMonths()
      .then(res => {
        setInspectionMonthsDateLimit(res.data.data)
      })
      .catch(e => console.log(e))

    vehicleService.getAllFromCategory(MACHINE_CATEGORY)
      .then(res => {
        setDisplayList(res.data.data)
        setDisplayListFiltered(res.data.data)
        setVehiclesCount(res.data.data.length)
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
      setDisplayListFiltered(displayList.filter((obj: any) =>
        obj.brand.includes(e.target.value.toLowerCase()) ||
        (!!obj.seatCount && obj.seatCount.toString().includes(e.target.value.toLowerCase())) ||
        obj.model.includes(e.target.value.toLowerCase())))
    }
  }

  /***************** LINKS *****************/
  let navigate = useNavigate()
  const addLink = () => {
    navigate("./detailsEquipment")
  }

  function detailsLink(isEdit: boolean, uid: string): string {
    return isEdit ?
      "./detailsEquipment?" + "isEdit=true&id=" + uid :
      "./detailsEquipment?" + "isEdit=false&id=" + uid
  }

  function trashItem(uid: number) {
    vehicleService.trashOne(uid)
    window.location.reload()
  }

  function untrashItem(uid: number) {
    vehicleService.untrashOne(uid)
    window.location.reload()
  }


  /***************** RENDER FUNCTION *****************/
  {/* <div className="flex flex-1 items-center justify-center rounded-lg shadow-sm"> */ }

  function renderItemList(displayList: any): React.ReactElement[] {

    const element: React.ReactElement[] = []
    let currentDate = new Date()
    let newDate = new Date(currentDate.setMonth(currentDate.getMonth() + inspectionDateMonthsLimit))

    if (displayList.length > 0) {
      displayList.map((item: any) => {
        element.push(
          <div key={item.id} className="flex flex-1 p-4 mb-4 rounded-lg border border-double">

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex">
                  <h3 className={`text-xl font-bold tracking-tight ${(item.deletedAt === null) ? '' : DELETED_STYLE}`}>
                    {UpperFirstLetter(item.brand) + " " + UpperFirstLetter(item.model) + (!item.year ? "" : " - " + item.year)}
                  </h3>
                  {new Date(item.safetyInspectionDate) <= newDate && !!item.safetyInspectionDate ? <><CircleAlert className="mx-1" /> CT : {new Date(item.safetyInspectionDate).toLocaleString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })} </> : <></>}
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-[160px]">

                {
                  (item.deletedAt === null) ?
                    <>
                      <DropdownMenuItem>  <Link className="flex" to={detailsLink(false, item.id)}> <Eye className="mr-4" /> Consulter </Link> </DropdownMenuItem>
                      {(accountService.checkRole("machines", ["w"])) ?
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

    else { element.push(<div key="0" className="flex flex-1 p-4 mb-4 rounded-lg border border-dashed">Aucun vehicule !</div>) }
    return element

  }

  /***************** RETURN FUNCTION *****************/

  return (
    <>
      <div className="flex items-center my-4">
        <h1 className="text-lg font-semibold md:text-2xl">Engins de manutention</h1>
      </div>

      <div className="flex flex-1 flex-col my-4 md:grid-cols-2 lg:grid-cols-3 gap-4 grid md:gap-8">

        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Engins de manutention
            </CardTitle>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehiclesCount}</div>
          </CardContent>
        </Card>

        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Problèmes en cours
            </CardTitle>
            <CircleAlert className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{issuesCount}</div>
            <p className="text-xs text-muted-foreground">
              +? cette semaine
            </p>
          </CardContent>
        </Card>

        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Problèmes résolus
            </CardTitle>
            <CircleCheck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedIssuesCount}</div>
            <p className="text-xs text-muted-foreground">
              +? cette semaine
            </p>
          </CardContent>
        </Card>

      </div>

      <div className="flex flex-col pt-4 gap-4 grid border-t border-dashed">
        <div className="flex">
          <Input className="flex flex-col mr-5 py-4 items-center w-2/3 "
            placeholder="Rechercher ..."
            value={displayFilter}
            onChange={onChangeFilter}
          />
          <div className="flex flex-col items-center text-center w-1/2">
            <Button className="flex items-center text-center w-full" onClick={() => addLink()}> <SquarePlus className="mr-2" /> Ajouter un équipement </Button>
          </div>
        </div>


        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Liste des engins de manutention : </h1>
        </div>

        <div className="flex flex-1 flex-col md:grid-cols-2 gap-2 grid">
          {renderItemList(displayListFiltered)}
        </div>
      </div>
    </>
  )
}