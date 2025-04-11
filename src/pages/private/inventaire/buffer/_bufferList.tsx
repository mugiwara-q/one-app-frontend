// ui imports
import { Button } from "@ui/button"
import { Label } from "@ui/label"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/select"

import {
  SquarePlus,
} from "lucide-react"

import { useState, useEffect, SetStateAction, Dispatch } from "react"
import { accountService } from "@/_services/account.service"
import { inventoryBufferService } from "@/_services/inventoryBuffer.service"
import { userService } from "@/_services/user.service"
import { UpperFirstLetter } from "@utils/helpers"

export default function BufferList({ updateTableTrigger, updateOutsideTable }: { updateTableTrigger: boolean, updateOutsideTable: Dispatch<SetStateAction<string>> }) {

  /***************** STATE VARIABLES *****************/


  const [userList, setUserList] = useState([]) // list of users
  const [selectedOwnerUserId, setSelectedOwnerUserId] = useState<string | null>("") // selected owner
  const [item, setItem] = useState({ id: "", model: "", brand: "" }) // item to add

  const [displayList, setDisplayList] = useState([]) // list to display
  const [bufferCount, setBufferCount] = useState<number>(0) // count total tools
  const [openDialog, setOpenDialog] = useState<boolean>(false) // open trigger for sheet component

  const [updateTable, setUpdateTable] = useState<boolean>(false) // to update date table

  /***************** LOAD DATA *****************/

  useEffect(() => {

    userService.getAll()
      .then(res => {
        setUserList(res.data.data)
      })
      .catch(e => console.log(e))

  }, [])

  // update DataTable
  useEffect(() => {

    inventoryBufferService.getAll()
      .then(res => {
        setDisplayList(res.data.data)
        console.log(res.data.data)
      })
      .catch(e => console.log(e))

    inventoryBufferService.getActiveCount()
      .then(res => {
        setBufferCount(res.data.data)
      })
      .catch(e => console.log(e))


  }, [updateTable, updateTableTrigger])

  // to reset selected owner between closed dialogs (and set "" (NaN value) on default )
  useEffect(() => {
    setSelectedOwnerUserId("")
  }, [openDialog])


  /***************** "LINKS" *****************/
  function addItemToInventory(selectedItem: any) {

    setItem(selectedItem)

    if (accountService.checkRole("inventaire", ["w"])) {

      // MOVE FROM BUFFER TO INVENTORY
      if (selectedItem.category === "outillage") {
        setOpenDialog(!openDialog) // open dialog to define owner ID
      }

      else {
        inventoryBufferService.moveToInventory(selectedItem.id, null) // null => no ownedById
          .then(() => { setUpdateTable(!updateTable) })
      }
      // update buffer table
      updateOutsideTable(selectedItem.category)
    }
  }

  function defineOwner(e: any) {

    e.preventDefault()

    if (accountService.checkRole("inventaire", ["w"])) {

      if (selectedOwnerUserId === "-1") {
        setSelectedOwnerUserId(null)
      }

      inventoryBufferService.moveToInventory(item.id, { ownedById: selectedOwnerUserId })
        .then(() => {
          setOpenDialog(!openDialog)
          setUpdateTable(!updateTable)
        })

    }

  }

  /***************** RENDER FUNCTION *****************/

  function renderTable(data: any): React.ReactElement[] {

    const element: React.ReactElement[] = []

    if (data.length > 0) {
      data.map((item: any) => {
        element.push(
          <div key={item.id} className="flex gap-4">
            <Button onClick={() => addItemToInventory(item)} variant="secondary" className="w-1/5">[{item.category.toUpperCase()}]</Button>
            <Button onClick={() => addItemToInventory(item)} variant="secondary" className="w-3/5">{(item.brand !== null ? item.brand.toUpperCase() + " - " : "") + item.model} [x{item.quantity}]</Button>
            <Button onClick={() => addItemToInventory(item)} variant="outline" className="w-1/5 bg-lime-900"> <SquarePlus className="mr-1" /> Ajouter </Button>
          </div >
        )
      })
    }

    else {
      element.push(<Button variant="secondary" className="w-full font-semibold" key="0" >BUFFER VIDE</Button>)
    }
    return element
  }

  // set vehicle types items
  function PopulateUserSelect(displayList: any): React.ReactElement[] {
    const element: React.ReactElement[] = []
    if (displayList.length > 0) {

      element.push(<SelectItem key="0" value="-1" >-</SelectItem>) // empty people
      displayList.map((user: any) => {
        element.push(<SelectItem key={user.id} value={user.id.toString()} >{UpperFirstLetter(user.name) + " " + user.familyName.toUpperCase()}</SelectItem>)
      })

    }
    else { element.push(<div key="0">Aucun utilisateur</div>) }
    return element
  }



  /***************** RETURN FUNCTION *****************/
  return (
    <>
      <div className="overflow-hidden border p-8 border-solid rounded-lg shadow-sm">

        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-bold tracking-tight">
            Buffer de l'inventaire : [{bufferCount}]
          </h3>
          <p className="text-sm text-muted-foreground pb-4">
            Items en attente d'être entrés dans l'inventaire.
          </p>

          {renderTable(displayList)}

        </div>
      </div>

      <Dialog
        open={openDialog}
        onOpenChange={() => {
          setOpenDialog(!openDialog)
        }}
      >
        <DialogContent className="p-10">
          <DialogHeader>
            <DialogTitle>
              Définir l'attribution de l'item ?
            </DialogTitle>
            <DialogDescription>
              {(item.brand !== null ? item.brand.toUpperCase() + "  " : "") + item.model.toUpperCase()}
            </DialogDescription>
          </DialogHeader>

          <form id="mainForm" onSubmit={defineOwner}>

            <div className="flex items-center grid gap-5 pb-10">
              <div className="grid gap-2">
                <Label>Attribuer à</Label>
                {
                  <Select
                    defaultValue="-1"
                    onValueChange={(userId) => setSelectedOwnerUserId(userId)}
                    required
                  >

                    <SelectTrigger>
                      <SelectValue placeholder="" />
                    </SelectTrigger>

                    <SelectContent >
                      {PopulateUserSelect(userList)}
                    </SelectContent>
                  </Select>
                }
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="w-1/2">
                Attribuer l'item
              </Button>

              <DialogClose className="w-1/2" asChild>
                <Button type="button" variant="destructive">
                  Ne pas attribuer
                </Button>
              </DialogClose>

            </div>
          </form>


        </DialogContent>
      </Dialog >
    </>
  )
}
