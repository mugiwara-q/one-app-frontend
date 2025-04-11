// ui imports
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs"
import { Badge } from "@ui/badge"
import { TriangleAlert } from "lucide-react"

import EnginList from "./machines/_machineList"
import VehiculeList from "./vehicles/_vehicleList"
import TrailerList from "./trailers/_trailerList"
import EquipmentList from "./equipments/_equipmentList"

import { vehicleService } from "@/_services/vehicle.service"
import { machineService } from "@/_services/machine.service"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Vehicule() {

  /***************** STATE VARIABLES *****************/
  const [vehiclesCount, setMachinesCount] = useState(0)
  const [machinesCount, setVehiclesCount] = useState(0)

  const [inspectionDateMonthsLimit, setInspectionMonthsDateLimit] = useState(0)
  const [expiredInspectionDateVehicles, setExpiredInspectionDateVehicles] = useState([])

  const [badgesCount, setBadgesCount] = useState(
    {
      vehicule: 0,
      remorque: 0,
      equipement: 0
    })

  const queryParameters = new URLSearchParams(window.location.search)
  const seeItem = queryParameters.get("see") || "a"

  /***************** SERVICES *****************/
  useEffect(() => {

    vehicleService.getActiveCount()
      .then(res => {
        setVehiclesCount(res.data.data)
      })
      .catch(e => console.log(e))

    machineService.getActiveCount()
      .then(res => {
        setMachinesCount(res.data.data)
      })
      .catch(e => console.log(e))

    vehicleService.getInspectionDateLimitMonths()
      .then(res => {
        setInspectionMonthsDateLimit(res.data.data)
      })
      .catch(e => console.log(e))

    vehicleService.getExpiredInspectionDate()
      .then(res => {
        setExpiredInspectionDateVehicles(res.data.data)

        console.log(res.data.data)

        // PROCESS BADGES
        setBadgesCount({ vehicule: 0, remorque: 0, equipement: 0 }) // EMPTY BADGES
        res.data.data.map((item: any) => {
          switch (item.VehicleType["category"]) {
            case "vehicule":
              setBadgesCount(badgesCount => ({ ...badgesCount, ["vehicule"]: badgesCount.vehicule + 1 }))
              break

            case "remorque":
              setBadgesCount(badgesCount => ({ ...badgesCount, ["remorque"]: badgesCount.remorque + 1 }))
              break

            case "equipement":
              setBadgesCount(badgesCount => ({ ...badgesCount, ["equipement"]: badgesCount.equipement + 1 }))
              break
          }

        })

      }).catch(e => console.log(e))

  }, [])

  /***************** SEE ITEM FROM TABLIST *****************/
  function updateSeeItem(see: string) {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set("see", see);
    history.pushState(null, "", "?" + queryParams.toString())
  }

  return (
    <>
      <div className="flex items-center pb-1 border-b ">
        <h1 className="font-semibold text-2xl">MACHINES : [{machinesCount + vehiclesCount}]</h1>
      </div>

      {expiredInspectionDateVehicles.length > 0 ?
        <div className="flex border-solid border-white text-white border rounded-md p-4 bg-red-900 items-center justify-center">
          <TriangleAlert className="mr-2" /> <Button className="font-medium mx-2"> {expiredInspectionDateVehicles.length} </Button> véhicules ont un contrôle technique expiré ou qui expire dans {inspectionDateMonthsLimit} mois. <TriangleAlert className="ml-2" />
        </div>

        : <></>
      }

      <Tabs defaultValue={seeItem} className="overflow-hidden">

        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="a" onClick={() => updateSeeItem("a")}>
            {badgesCount.vehicule > 0 ? <Badge className="w-6  mr-2 items-center justify-center rounded-full"> {badgesCount.vehicule}</Badge> : <></>} Véhicules
          </TabsTrigger>

          <TabsTrigger value="b" onClick={() => updateSeeItem("b")}>Engins</TabsTrigger>

          <TabsTrigger value="c" onClick={() => updateSeeItem("c")}>
            {badgesCount.remorque > 0 ? <Badge className="w-6  mr-2 items-center justify-center rounded-full"> {badgesCount.remorque}</Badge> : <></>} Remorques
          </TabsTrigger>

          <TabsTrigger value="d" onClick={() => updateSeeItem("d")}>
            {badgesCount.equipement > 0 ? <Badge className="w-6  mr-2 items-center justify-center rounded-full"> {badgesCount.equipement}</Badge> : <></>}  Manutention
          </TabsTrigger>
        </TabsList>

        <TabsContent value="a" className=" ">
          <VehiculeList />
        </TabsContent>

        <TabsContent value="b" className=" ">
          <EnginList />
        </TabsContent>

        <TabsContent value="c" className=" ">
          <TrailerList />
        </TabsContent>

        <TabsContent value="d" className=" ">
          <EquipmentList />
        </TabsContent>
      </Tabs>
    </>
  )
}