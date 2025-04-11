
import { Button } from "@ui/button"
import { Label } from "@ui/label"
import { Input } from "@ui/input"
import { Textarea } from "@ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/select"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@ui/input-otp"

import {
    Copy
} from "lucide-react"

import { useEffect, useState } from "react"
import { UpperFirstLetter, CopyToClipBoard, ParseIsoDateToNumber } from "@/_utils/helpers"

import { wishItemService } from "@/_services/wishItem.service"


export default function BuyList() {

    const [displayList, setDisplayList] = useState([]) // list to display
    const [updateTable, setUpdateTable] = useState<boolean>(false) // to update date table
    const [openDialog, setOpenDialog] = useState<boolean>(false) // open trigger for sheet component


    const [showItemData, setShowItemData] = useState({
        title: "",
        link: "",
        note: "",
        price: "",
        quantity: "",
        createdAt: "",
        "User.familyName": "",
        "User.name": ""
    })

    // update DataTable
    useEffect(() => {
        wishItemService.getAllActive()
            .then(res => {
                setDisplayList(res.data.data)
            })
            .catch(e => console.log(e))

    }, [updateTable])



    const changeItemState = (iid: number, state: string) => {
        //userService.untrashUser(uid)
        wishItemService.editOne(iid, { state: state })
            .then(() => setUpdateTable(!updateTable))
            .catch((error: any) => {
                console.log(error)
            })

    }

    function openAlertDialog(item: any) {
        setShowItemData(item)
        setOpenDialog(!openDialog)
    }

    /***************** RENDER FUNCTION *****************/
    function renderTable(data: any): React.ReactElement[] {

        const element: React.ReactElement[] = []

        element.push(
            <div className="flex gap-4 pb-5" key={0}>
                <Button variant="outline" className="w-1/3" >Emmeteur</Button>
                <Button variant="outline" className="w-1/3" >Titre de la demande</Button>
                <Button variant="outline" className="w-1/3">Etat</Button>
            </div>
        )

        if (data.length > 0) {
            data.map((item: any) => {
                let color = ""
                let state = ""

                switch (item.state) {
                    case "recu":
                        color = "bg-lime-900 text-white"
                        state = "Colis reçu"
                        break
                    case "livraison":
                        color = "bg-yellow-800 text-white"
                        state = "En cours de livraison"
                        break
                    case "traite":
                        color = "bg-neutral-900 text-white"
                        state = "Traité"
                        break
                    case "refuse":
                        color = "bg-red-900 text-white"
                        state = "Refusé"
                        break
                    default:
                        color = "bg-gray-900 text-white"
                        state = "En attente"
                        break
                }

                let selectedValue = state

                element.push(
                    <div className="flex gap-4" key={item.id}>
                        <Button onClick={() => { openAlertDialog(item) }} variant="ghost" className={`w-1/3 ${color}`} >{item["User.familyName"].toUpperCase() + " " + UpperFirstLetter(item["User.name"])} </Button >
                        <Button onClick={() => { openAlertDialog(item) }} variant="ghost" className={`w-1/3 ${color}`} >{item.title.toUpperCase()} </Button >

                        <Select
                            defaultValue={item.state}
                            onValueChange={(itemState) => changeItemState(item.id, itemState)}>
                            <SelectTrigger className={`w-1/3 font-semibold ${color}`}>
                                <SelectValue placeholder={selectedValue} />
                            </SelectTrigger>

                            <SelectContent className="w-48">
                                <SelectItem value="attente" className="bg-gray-900 text-white">En attente</SelectItem>
                                <SelectItem value="refuse" className="bg-red-900 text-white">Refusé</SelectItem>
                                <SelectItem value="traite" className="bg-neutral-900 text-white">Traité</SelectItem>
                                <SelectItem value="livraison" className="bg-yellow-800 text-white">En livraison</SelectItem>
                                <SelectItem value="recu" className="bg-lime-900 text-white">Reçu</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )
            })
        }

        else {
            element.push(
                <div className="flex gap-4" key="1">
                    <Button className="font-semibold w-2/3" variant="ghost"> AUCUNE DEMANDE </Button >
                    <Button className="font-semibold w-1/3" variant="ghost"> - </Button >
                </div>
            )
        }
        return element
    }

    return (

        <>
            <div className="grid gap-5 pt-5">

                <div className="overflow-hidden border p-10 border-solid rounded-lg shadow-sm">

                    <div className="flex flex-col gap-1">
                        <h3 className="text-2xl font-bold tracking-tight">
                            Liste des demandes d'achats :
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Etat des demandes.
                        </p>
                        <br />
                        {renderTable(displayList)}
                    </div>
                </div>

                {/* <div className="overflow-hidden border p-10 border-solid rounded-lg shadow-sm">

                    <div className="flex flex-col gap-1">
                        <h3 className="text-2xl font-bold tracking-tight">
                            Buffer de l'inventaire :
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Items en attente d'être entrés dans l'inventaire
                        </p>
                        <Button className="my-5">
                            <SquarePlus className="mr-1" />
                            Ajouter des items au buffer (achetés)
                        </Button>

                        {renderTable(displayList)}
                    </div>
                </div> */}

            </div>

            <Dialog open={openDialog} onOpenChange={() => { setOpenDialog(!openDialog) }}>
                <DialogContent className="p-10">
                    <DialogHeader>
                        <DialogTitle>Details de la demande :</DialogTitle>
                        <DialogDescription>
                            Demandé par : {showItemData["User.familyName"].toUpperCase() + " " + UpperFirstLetter(showItemData["User.name"])}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex items-center grid gap-5 p-5">

                        <div className="grid gap-2">
                            <Label htmlFor="title">Titre de la demande</Label>
                            <Input
                                readOnly
                                value={showItemData.title}
                                name="title"
                                type="text"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="quantity">Quantité</Label>
                            <Input
                                readOnly
                                value={showItemData.quantity}
                                name="quantity"
                                type="number"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="price">Prix total (€)</Label>
                            <Input
                                readOnly
                                value={showItemData.price}
                                name="price"
                                type="number"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Note</Label>
                            <Textarea
                                readOnly
                                className="h-20"
                                value={showItemData.note || " "}
                                name="note"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="createdAt">Date d'emission de la demande</Label>
                            <InputOTP
                                value={ParseIsoDateToNumber(showItemData.createdAt)}
                                name="createdAt"
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

                        <div className="grid gap-2">
                            <Label htmlFor="Link">Lien URL</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="link"
                                    value={showItemData.link || " "}
                                    readOnly
                                />
                                <Button className="focus:bg-lime-900 focus:text-white"
                                    onClick={() => CopyToClipBoard(showItemData.link)}>
                                    <Copy className="mr-2" /> Copier
                                </Button>

                            </div>
                        </div>
                    </div>

                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Fermer
                        </Button>
                    </DialogClose>
                </DialogContent>
            </Dialog>
        </>


    )
}