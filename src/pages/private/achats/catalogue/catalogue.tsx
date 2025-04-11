// ui imports
import { Button } from "@ui/button"
import { Input } from "@ui/input"
import { Label } from "@ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ui/table"
import { Card, CardDescription, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@ui/sheet"

import {
  CircleCheck,
  SquareMinus,
  SquarePlus,
  Eye,
  CircleX,
  RotateCw,
  Pencil,
} from "lucide-react"

import { useState, useEffect } from "react"

import { EmptyObject, } from "@/_utils/helpers"

import { accountService } from "@/_services/account.service"
import { catalogueItemService } from "@/_services/catalogueItem.service"

export default function Catalogue() {

  /***************** STATE VARIABLES *****************/
  const [displayList, setDisplayList] = useState([]) // list to display BEFORE filter applied
  const [displayListFiltered, setDisplayListFiltered] = useState([]) // list to display AFTER filter applied
  const [displayFilterInput, setDisplayFilterInput] = useState("") // "research" filter string
  const DELETED_STYLE = "text-red-600 line-through"

  const [sheetOpen, setSheetOpen] = useState<boolean>(false) // open trigger for sheet component
  const [itemViewState, setItemViewState] = useState<string>("add") // edit | add | show

  const [itemId, setItemId] = useState<string | null>(null) // item ID

  const [submitState, setSubmitState] = useState<string>("") // for spin animation
  const [updateTable, setUpdateTable] = useState<boolean>(false) // to update date table
  const [updateItem, setUpdateItem] = useState<boolean | null>(null) // to update item data

  const [itemData, setItemData] = useState({
    brand: "",
    model: "",
    reference: "",
    description: "",
    quantity: "",
    price: "",
  })

  /***************** LOAD DATA *****************/
  // populate itemData
  useEffect(() => {
    if ((itemViewState === "edit" || itemViewState === "show") && itemId !== null && !isNaN(parseInt(itemId))) { // EDIT OR SHOW
      catalogueItemService.getOne(itemId)
        .then(res => {
          (document.getElementById("mainForm") as HTMLFormElement).reset()
          console.log(res.data.data)
          Object.keys(res.data.data).forEach(function (key) {
            (res.data.data[key] === null || res.data.data[key] === undefined) ?
              setItemData(itemData => ({ ...itemData, [key]: "" })) :
              setItemData(itemData => ({ ...itemData, [key]: res.data.data[key] }))


          })
        })
        .catch((e) => console.log(e))
    }

  }, [updateItem])

  // update DataTable
  useEffect(() => {

    catalogueItemService.getAll()
      .then(res => {
        setDisplayList(res.data.data)
        setDisplayListFiltered(res.data.data)
      })
      .catch(e => console.log(e))

  }, [updateTable])

  /***************** FILTER SHOWS FROM INPUTS *****************/
  function onChangeFilter(inputText: any) {

    setDisplayFilterInput(inputText)

    if (inputText === "") {
      setDisplayListFiltered(displayList)
    }

    else {
      setDisplayListFiltered(displayList.filter((obj: any) =>
      (obj.model.includes(inputText.toLowerCase())
        || obj.brand.includes(inputText.toLowerCase()))
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

    let submitedData = { ...itemData } // to clone without affecting display

    if (itemId === null || isNaN(parseInt(itemId))) { // add
      catalogueItemService.addOne(submitedData)
        .then(() => {
          setSubmitState("done")
        }).then(() => setUpdateTable(!updateTable))
        .catch(() => {
          setSubmitState("error")
        })
    }

    else { // edit
      catalogueItemService.editOne(itemId, submitedData)
        .then(() => {
          setSubmitState("done")
        })
        .catch(() => {
          setSubmitState("error")
        })
    }

  }


  /***************** "LINKS" *****************/
  function trashItem(iid: number) {
    catalogueItemService.trashOne(iid)
      .then(() => setUpdateTable(!updateTable))
  }

  function actionOnButton(action: string, itemId: string | null) {

    switch (action) {
      case "edit":
        setUpdateItem(!updateItem)
        setSheetOpen(!sheetOpen)
        setItemId(itemId)
        setItemViewState("edit")
        break

      case "show":
        setUpdateItem(!updateItem)
        setSheetOpen(!sheetOpen)
        setItemId(itemId)
        setItemViewState("show")
        break

      default: // add
        setItemViewState("add")
        setSubmitState("")
        setItemId(null)
        setUpdateItem(!updateItem)

        setItemData(EmptyObject(itemData))
        setItemData(itemData => ({ ...itemData, ["category"]: "" }))
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
            {itemViewState === "add" ?
              "Ajout en cours ..." :
              "Modification en cours"
            }
          </Button>
        </>)

      case "done":
        return (<>
          <Button className="flex items-center text-center w-full bg-lime-900 text-white ">
            <CircleCheck className="mr-2 h-4 w-4" />
            {itemViewState === "add" ?
              "Item ajouté avec succès !" :
              "Item modifié avec succès !"
            }
          </Button>
        </>)

      case "error":
        return (<>
          <Button variant="destructive" className="flex items-center text-center w-full">
            <CircleX className="mr-2 h-4 w-4" />
            {itemViewState === "add" ?
              "Erreur lors de l'ajout !" :
              "Erreur lors de la modification"
            }
          </Button>
        </>)

      default:
        return (<></>)

    }
  }

  /***************** RENDER FUNCTION *****************/
  {/* <div className="flex flex-1 items-center justify-center rounded-lg shadow-sm"> */ }

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
                      onClick={() => actionOnButton("show", item.id)}>
                      <Eye className="" />
                    </Button>

                    {(accountService.checkRole("inventaire", ["w"])) ?
                      <>
                        <Button
                          onClick={() => actionOnButton("edit", item.id)}>
                          <Pencil className="" />
                        </Button>

                        <Button onClick={() => trashItem(item.id)}>
                          <SquareMinus className="" />
                        </Button>
                      </>
                      : <></>
                    }
                  </>
                  :
                  <></>
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
            <TableCell>
              <Input
                disabled
                type="number"
                defaultValue={item.quantity}
              />
            </TableCell>
          </TableRow>
        )
      })
    }

    else {
      element.push(<TableRow key="0"><TableCell className="font-semibold">CATALOGUE VIDE</TableCell></TableRow>)
    }
    return element

  }

  /***************** RETURN FUNCTION *****************/

  return (
    <>
      <div className="flex flex-1 flex-col pt-4 gap-4">
        <Card className="">
          <CardHeader>
            <CardTitle>Catalogue fournisseur</CardTitle>
            <CardDescription>
              Liste des produits répertoriéss dans le catalogue fournisseur
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="border-y">
              <Button
                className="my-4 w-full"
                onClick={() => { actionOnButton("add", null) }}
                {...accountService.checkRole("achats", ["w"]) ? { disabled: false } : { disabled: true }}
              >
                <SquarePlus className="mr-1 hover:animate-spin" /> Ajouter des items au catalogue
              </Button>

              <div className="flex justify-center gap-2">
                <Input className="flex flex-col items-center w-1/2"
                  placeholder="Rechercher par modèle ..."
                  value={displayFilterInput}
                  onChange={(e) => onChangeFilter(e.target.value)}
                />

                <Input className="flex flex-col items-center w-1/2"
                  placeholder="Rechercher par fournisseur ..."
                  value={displayFilterInput}
                  onChange={(e) => onChangeFilter(e.target.value)}
                />
              </div>

              <div className="flex items-center text-center">
                <Button variant="ghost" className="">
                  {displayListFiltered.length || 0} resultats
                </Button>
              </div>

            </div>

            <Table>
              <TableHeader className="">
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead className="w-[100px]">
                    <div className="flex items-center text-center gap-2">Fournisseur</div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center text-center gap-2">Description / Modèle{/* <Button variant="outline" onClick={() => console.log("OKOK")}><ArrowDownAZ /></Button> */}</div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center text-center gap-2">Reference{/* <Button variant="outline" onClick={() => console.log("OKOK")}><ArrowDownAZ /></Button> */}</div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center text-center gap-2">Quantité{/* <Button variant="outline" onClick={() => console.log("OKOK")}><ArrowDownAZ /></Button> */}</div>
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

      <Sheet open={sheetOpen} onOpenChange={() => { setSheetOpen(!sheetOpen) }}>
        <SheetContent className="pt-10 w-screen md:w-auto" side="right">
          <SheetHeader>
            {itemViewState === "edit" ?
              <><SheetTitle>Modifier un produit :</SheetTitle>
                <SheetDescription>Modifie un produit du catalogue.</SheetDescription></>
              :
              itemViewState === "show" ?
                <><SheetTitle>Consulter un produit :</SheetTitle>
                  <SheetDescription>Consulter les détails d'un produit du catalogue.</SheetDescription></>
                :
                <><SheetTitle>Ajouter un produit :</SheetTitle>
                  <SheetDescription>Complète le catalogue d'un produit.</SheetDescription></>
            }
          </SheetHeader>

          <form id="mainForm" onSubmit={onSubmit} className="pt-10 grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="brand">Fournisseur</Label>
              <Input
                {...itemViewState === "edit" || itemViewState === "add" ? { disabled: false } : { disabled: true }}
                autoComplete="off"
                value={itemData.brand}
                onChange={onChange}
                name="brand"
                type="text"
                required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="model">Modèle</Label>
              <Input
                {...itemViewState === "edit" || itemViewState === "add" ? { disabled: false } : { disabled: true }}
                autoComplete="off"
                value={itemData.model}
                onChange={onChange}
                name="model"
                type="text"
                required />

            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description / Détails</Label>
              <Input
                {...itemViewState === "edit" || itemViewState === "add" ? { disabled: false } : { disabled: true }}
                autoComplete="off"
                value={itemData.description}
                onChange={onChange}
                name="description"
                type="text"
                required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reference">Reference</Label>

              <Input
                autoComplete="off"
                value={itemData.reference}
                onChange={onChange}
                name="reference"
                type="text"
                required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantité</Label>
              <Input
                {...itemViewState === "edit" || itemViewState === "add" ? { disabled: false } : { disabled: true }}
                autoComplete="off"
                value={itemData.quantity}
                onChange={onChange}
                name="quantity"
                type="number" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">Prix d'achat (€)</Label>
              <Input
                {...itemViewState === "edit" || itemViewState === "add" ? { disabled: false } : { disabled: true }}
                value={itemData.price}
                onChange={onChange}
                name="price"
                placeholder="0,00€"
                type="number" />
            </div>


            <div className={`flex mt-5 ${itemViewState === "edit" || itemViewState === "add" ? "" : "hidden"}`} >

              {itemViewState === "add" ?
                <>
                  <Button type="submit" className="flex flex-col w-2/3 items-center gap-1 text-center">Ajouter</Button>
                  <Button variant="destructive"
                    onClick={() => setSheetOpen(!sheetOpen)}
                    className="flex flex-col ml-5 py-4 items-center text-center w-1/3"> Annuler </Button>
                </> :
                <>
                  <Button type="submit" className="flex flex-col w-2/3 items-center gap-1 text-center">Enregistrer les modifications</Button>
                  <Button type="button" variant="destructive"
                    onClick={() => {
                      setItemId(null)
                      setSubmitState("")
                    }}
                    className="flex flex-col ml-5 py-4 items-center text-center w-1/3"> Annuler</Button>
                </>}
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