// ui imports
import { Button } from "@ui/button"
import { Input } from "@ui/input"
import { Label } from "@ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ui/table"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@ui/input-otp"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/select"
import { userService } from "@/_services/user.service"

import {
  CircleCheck,
  SquareMinus,
  History,
  Eye,
  CircleX,
  RotateCw,
  Pencil
} from "lucide-react"

import { useState, useEffect } from "react"

import { EmptyObject, ParseNumberToIsoDate, ParseIsoDateToNumber, UpperFirstLetter } from "@/_utils/helpers"

import { accountService } from "@/_services/account.service"
import { inventoryItemService } from "@/_services/inventoryItem.service"

export default function ToolList({ updateTableTrigger }: { updateTableTrigger: boolean }) {

  /***************** STATE VARIABLES *****************/
  const [userList, setUserList] = useState([]) // list of users
  const [displayList, setDisplayList] = useState([]) // list to display BEFORE filter applied
  const [displayListFiltered, setDisplayListFiltered] = useState([]) // list to display AFTER filter applied
  const [displayFilterInput, setDisplayFilterInput] = useState("") // "research" filter string
  const DELETED_STYLE = "text-red-600 line-through"

  const [viewActiveItems, setViewActiveItems] = useState<boolean>(true) // count total tools

  const [sheetOpen, setSheetOpen] = useState<boolean>(false) // open trigger for sheet component
  const [itemViewState, setItemViewState] = useState<string>("add") // edit | add | show

  const [itemId, setItemId] = useState<string | null>(null) // item ID 

  const [submitState, setSubmitState] = useState<string>("") // for spin animation
  const [updateTable, setUpdateTable] = useState<boolean>(false) // to update date table
  const [updateItem, setUpdateItem] = useState<boolean | null>(null) // to update item data

  const ITEM_CATEGORY = "outillage"

  const [itemData, setItemData] = useState({
    brand: "",
    model: "",
    category: ITEM_CATEGORY,
    reference: "",
    ownedById: "",
    unitPrice: "",
    quantity: "",
    boughtAt: "",
  })

  /***************** LOAD DATA *****************/
  // populate itemData
  useEffect(() => {
    if ((itemViewState === "edit" || itemViewState === "show") && itemId !== null && !isNaN(parseInt(itemId))) { // EDIT OR SHOW
      inventoryItemService.getOne(itemId)
        .then(res => {
          (document.getElementById("mainForm") as HTMLFormElement).reset()
          Object.keys(res.data.data).forEach(function (key) {
            (key === "ownedById" && res.data.data[key] === null) ?
              setItemData(itemData => ({ ...itemData, [key]: "-1" })) :

              (res.data.data[key] === null || res.data.data[key] === undefined) ?
                setItemData(itemData => ({ ...itemData, [key]: "" })) :

                (key === "boughtAt") ?
                  setItemData(itemData => ({ ...itemData, [key]: ParseIsoDateToNumber(res.data.data[key]) }))
                  :
                  setItemData(itemData => ({ ...itemData, [key]: res.data.data[key] }))


          })
        })
        .catch((e) => console.log(e))
    }

  }, [updateItem])

  // update DataTable
  useEffect(() => {

    if (viewActiveItems) {
      inventoryItemService.getAllActiveFromCategory(ITEM_CATEGORY)
        .then(res => {
          setDisplayList(res.data.data)
          setDisplayListFiltered(res.data.data)
        })
        .catch(e => console.log(e))
    }

    else {
      inventoryItemService.getAllTrashFromCategory(ITEM_CATEGORY)
        .then(res => {
          setDisplayList(res.data.data)
          setDisplayListFiltered(res.data.data)
        })
        .catch(e => console.log(e))
    }

  }, [updateTable, updateTableTrigger])

  /***************** LOAD DATA *****************/

  useEffect(() => {

    userService.getAll()
      .then(res => {
        setUserList(res.data.data)
      })
      .catch(e => console.log(e))

  }, [])

  /***************** FILTER SHOWS FROM INPUTS *****************/
  function onChangeFilter(inputText: any) {

    setDisplayFilterInput(inputText)

    if (inputText === "") {
      setDisplayListFiltered(displayList)
    }

    else {
      setDisplayListFiltered(displayList.filter((obj: any) =>
      (obj.model.includes(inputText.toLowerCase())
        || (obj.ownedByUser !== null ? obj.ownedByUser.familyName.includes(inputText.toLowerCase()) : false)
        || (obj.ownedByUser !== null ? obj.ownedByUser.name.includes(inputText.toLowerCase()) : false)
        || obj.brand.includes(inputText.toLowerCase())
      )
      ))
    }
  }


  /***************** SET DATA INSIDE INPUTS *****************/
  const onChange = (e: any) => {
    setItemData({ ...itemData, [e.target.name]: e.target.value })
  }

  /***************** SUBMIT CREDENTIALS TO API *****************/

  const onSubmit = (e: any) => {
    e.preventDefault()
    setSubmitState("loading")

    if (itemData.boughtAt.length === 8 || itemData.boughtAt.length === 0) { // empty or filled

      let submitedData = { ...itemData } // to clone without affecting display
      if (itemData.boughtAt.length === 8) { // if date not empty => format date
        submitedData.boughtAt = ParseNumberToIsoDate(submitedData.boughtAt) // ISO DATE FORMAT
      }

      if (itemData.ownedById === "-1") {
        submitedData.ownedById = ""
      }

      if (itemId === null || isNaN(parseInt(itemId))) { // add
        inventoryItemService.addOne(submitedData)
          .then(() => {
            setSubmitState("done")
          }).then(() => setUpdateTable(!updateTable))
          .catch(() => {
            setSubmitState("error")
          })
      }

      else { // edit
        inventoryItemService.editOne(itemId, submitedData)
          .then(() => {
            setSubmitState("done")
          })
          .catch(() => {
            setSubmitState("error")
          })
      }

    }
    else {
      setSubmitState("error")
    }
  }

  /***************** "LINKS" *****************/
  function trashItem(iid: number) {
    inventoryItemService.trashOne(iid)
      .then(() => setUpdateTable(!updateTable))
  }

  function untrashItem(iid: number) {
    inventoryItemService.untrashOne(iid)
      .then(() => setUpdateTable(!updateTable))
  }

  function actionOnButton(action: string, itemId: string | null) {

    switch (action) {
      case "edit":
        setItemData(EmptyObject(itemData)) // to reset display
        setItemId(itemId)
        setUpdateItem(!updateItem)
        setSheetOpen(!sheetOpen)
        setItemViewState("edit")
        break

      case "show":
        setItemData(EmptyObject(itemData)) // to reset display
        setItemId(itemId)
        setUpdateItem(!updateItem)
        setSheetOpen(!sheetOpen)
        setItemViewState("show")
        break

      default: // add
        setItemViewState("add")
        setSubmitState("")
        setItemId(null)
        setUpdateItem(!updateItem)

        setItemData(EmptyObject(itemData))
        setItemData(itemData => ({ ...itemData, ["category"]: ITEM_CATEGORY }))
        setSheetOpen(!sheetOpen)
        break
    }

  }

  /***************** STATE SUBMIT INFORMATION *****************/
  function changeState(state: string): React.ReactElement {
    switch (state) {
      case "loading":
        return (<>
          <Button disabled className="flex items-center text-center w-full">
            <RotateCw className="mr-2 h-4 w-4 animate-spin" />
            "Modification en cours"
          </Button>
        </>)

      case "done":
        return (<>
          <Button className="flex items-center text-center w-full bg-lime-900 text-white ">
            <CircleCheck className="mr-2 h-4 w-4" />
            "Item modifié avec succès !"
          </Button>
        </>)

      case "error":
        return (<>
          <Button variant="destructive" className="flex items-center text-center w-full">
            <CircleX className="mr-2 h-4 w-4" />
            "Erreur lors de la modification"
          </Button>
        </>)

      default:
        return (<></>)

    }
  }

  // set vehicle types items
  function PopulateUserSelect(displayList: any): React.ReactElement[] {
    const element: React.ReactElement[] = []
    if (displayList.length > 0) {
      element.push(<SelectItem key="0" value="-1" >-</SelectItem>) // empyty one
      displayList.map((user: any) => {
        element.push(<SelectItem key={user.id} value={user.id.toString()} >{UpperFirstLetter(user.name) + " " + user.familyName.toUpperCase()}</SelectItem>)
      })
    }
    else { element.push(<div key="0">Aucun utilisateur</div>) }
    return element
  }

  /***************** RENDER FUNCTION *****************/

  function renderTable(data: any): React.ReactElement[] {

    const element: React.ReactElement[] = []

    if (data.length > 0) {
      data.map((item: any) => {
        element.push(
          <TableRow key={item.id} className={`${(item.deletedAt === null) ? '' : DELETED_STYLE}`}>
            <TableCell className="font-semibold flex gap-2">
              {
                (item.deletedAt === null) ?
                  <>
                    <Button
                      variant="secondary"
                      onClick={() => actionOnButton("show", item.id)}>
                      <Eye className="" />
                    </Button>

                    {(accountService.checkRole("inventaire", ["w"])) ?
                      <>
                        <Button
                          variant="secondary"
                          onClick={() => actionOnButton("edit", item.id)}>
                          <Pencil className="" />
                        </Button>

                        <Button
                          variant="secondary"
                          onClick={() => trashItem(item.id)}>
                          <SquareMinus className="" />
                        </Button>
                      </>
                      : <></>
                    }
                  </>
                  :
                  <Button onClick={() => untrashItem(item.id)}>
                    <History className="" />
                  </Button>
              }
            </TableCell>

            <TableCell className="font-semibold">{item.brand.toUpperCase()}</TableCell>
            <TableCell className="font-semibold">{item.model.toUpperCase()}</TableCell>
            <TableCell>
              <Input
                disabled
                type="text"
                defaultValue={item.reference.toUpperCase()}
              />
            </TableCell>
            <TableCell className="font-semibold">{!item.ownedByUser ? "-" : UpperFirstLetter(item.ownedByUser.name) + " " + item.ownedByUser.familyName[0].toUpperCase() + "."}</TableCell>
          </TableRow>
        )
      })
    }

    else {
      element.push(<TableRow key="0"><TableCell className="font-semibold">INVENTAIRE VIDE</TableCell></TableRow>)
    }
    return element

  }

  /***************** RETURN FUNCTION *****************/

  return (
    <>
      <div className="flex flex-1 flex-col pt-4 gap-4 border-t border-dashed">

        {/* {renderTable(displayListFiltered)} */}
        <Card className="">
          <CardHeader>
            <CardTitle>Inventaire des outils</CardTitle>
            <CardDescription>
              Liste des outils répertoriés dans l'atelier
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-y py-4">
              <div className="flex justify-center py-4">
                <Input className="flex flex-col mr-5 py-4 items-center w-4/5"
                  placeholder="Rechercher ..."
                  value={displayFilterInput}
                  onChange={(e) => onChangeFilter(e.target.value)}
                />
                <div className="flex flex-col items-center text-center w-1/5">
                  <Button variant="ghost" className="">
                    {displayListFiltered.length || 0} resultats
                  </Button>
                </div>
              </div>

              <div className="flex items-start items-center space-x-2">

                <Button variant="secondary" className="truncate " onClick={() => {
                  setViewActiveItems(!viewActiveItems) // update button state
                  setUpdateTable(!updateTable) // update the current table
                }}>
                  <Eye className="mr-1" />

                  {viewActiveItems ? "Outils supprimés" : "Outils actifs"}
                </Button>

              </div>
            </div>

            <Table>
              <TableHeader className="">
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead className="w-[100px]">
                    <div className="flex items-center text-center gap-2">Marque</div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center text-center gap-2">Modèle / Reference</div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center text-center gap-2">Numéro de serie</div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center text-center gap-2">Attribution</div>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {renderTable(displayListFiltered)}
              </TableBody>
            </Table>
          </CardContent >

          <CardFooter className="justify-center border-t p-4 gap-2">
            <Button size="sm" variant="secondary">
              Page precedente
            </Button>
            <Button size="sm" variant="secondary">
              Page suivante
            </Button>
          </CardFooter>

        </Card >
      </div>

      <Sheet open={sheetOpen} onOpenChange={() => setSheetOpen(!sheetOpen)}>
        <SheetContent className="pt-10 w-screen md:w-auto" side="right">
          <SheetHeader>
            {itemViewState === "edit" ?
              <><SheetTitle>Modifier un outil :</SheetTitle>
                <SheetDescription>Modifie un outil de l'inventaire.</SheetDescription></>
              :
              itemViewState === "show" ?
                <><SheetTitle>Consulter un outil :</SheetTitle>
                  <SheetDescription>Consulter les détails d'un outil de l'inventaire.</SheetDescription></>
                :
                <><SheetTitle>Ajouter un outil :</SheetTitle>
                  <SheetDescription>Complète l'inventaire d'un nouvel outil.</SheetDescription></>
            }
          </SheetHeader>

          <form id="mainForm" onSubmit={onSubmit} className="pt-10 grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="brand">Marque</Label>
              <Input
                {...itemViewState === "edit" ? { disabled: false } : { disabled: true }}
                value={itemData.brand}
                onChange={onChange}
                name="brand"
                type="text"
                required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="model">Modèle / Reference</Label>
              <Input
                {...itemViewState === "edit" ? { disabled: false } : { disabled: true }}
                value={itemData.model}
                onChange={onChange}
                name="model"
                type="text"
                required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reference">Numéro de série</Label>
              <Input
                {...itemViewState === "edit" ? { disabled: false } : { disabled: true }}
                value={itemData.reference}
                onChange={onChange}
                name="reference"
                type="text"
                required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="unitPrice">Prix d'achat (€)</Label>
              <Input
                {...itemViewState === "edit" ? { disabled: false } : { disabled: true }}
                value={itemData.unitPrice}
                onChange={onChange}
                placeholder="0,00 €"
                name="unitPrice"
                type="number" />
            </div>

            <div className="grid gap-2">
              <Label>Attribution</Label>
              {
                parseInt(itemData.ownedById) >= -1 ?
                  <Select
                    {...itemViewState === "edit" ? { disabled: false } : { disabled: true }}
                    defaultValue={itemData.ownedById.toString()}
                    onValueChange={(userId) => setItemData({ ...itemData, ["ownedById"]: userId })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={itemData.ownedById} />
                    </SelectTrigger>

                    <SelectContent >
                      {PopulateUserSelect(userList)}
                    </SelectContent>
                  </Select>
                  :
                  <></>
              }
            </div>

            <div className="grid gap-2">
              <Label htmlFor="boughtAt">Date d'achat</Label>
              <InputOTP
                {...itemViewState === "edit" ? { disabled: false } : { disabled: true }}
                value={itemData.boughtAt}
                onChange={(newValue) => setItemData(itemData => ({ ...itemData, ["boughtAt"]: newValue }))}
                name="boughtAt"
                maxLength={8}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                </InputOTPGroup>

                <InputOTPGroup>
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>

                <InputOTPGroup>
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                  <InputOTPSlot index={6} />
                  <InputOTPSlot index={7} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className={`flex mt-5 ${itemViewState === "edit" ? "" : "hidden"}`} >
              <Button type="submit" className="flex flex-col w-2/3 items-center gap-1 text-center">Enregistrer les modifications</Button>
              <Button type="button" variant="destructive"
                onClick={() => {
                  setItemId(null)
                  setSubmitState("")
                }}
                className="flex flex-col ml-5 py-4 items-center text-center w-1/3"> Annuler</Button>
            </div>

          </form>

          <div className="flex mt-5">
            {itemViewState != "show" ? changeState(submitState) : ""}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}