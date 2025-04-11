
import { Button } from "@ui/button"
import { Label } from "@ui/label"
import { Input } from "@ui/input"
import { Textarea } from "@ui/textarea"

import {
    CircleX,
    CircleCheck,
    RotateCw,

    SquarePlus,
    SquareMinus
} from "lucide-react"

import { useEffect, useState } from "react"

import { wishItemService } from "@/_services/wishItem.service"


export default function Panier() {

    const [displayList, setDisplayList] = useState([]) // list to display
    const [submitState, setSubmitState] = useState<string>("") // for spin animation
    const [updateTable, setUpdateTable] = useState<boolean>(false) // to update date table

    const [itemData, setItemData] = useState({
        title: "",
        link: "",
        note: "",
        price: "",
        quantity: 1,
    })

    // update DataTable
    useEffect(() => {
        wishItemService.getAllActiveFromMe()
            .then(res => {
                setDisplayList(res.data.data)
            })
            .catch(e => console.log(e))

    }, [updateTable])

    /***************** SET DATA INSIDE INPUTS *****************/
    const onChange = (e: any) => {
        setItemData({ ...itemData, [e.target.name]: e.target.value })
    }

    /***************** SUBMIT CREDENTIALS TO API *****************/

    const onSubmit = (e: any) => {
        e.preventDefault()
        setSubmitState("loading")

        wishItemService.addOne(itemData)
            .then(() => {
                setSubmitState("done")
            }).then(() => setUpdateTable(!updateTable))
            .catch(() => {
                setSubmitState("error")
            })

    }

    /***************** STATE SUBMIT INFORMATION *****************/
    function changeState(state: string): React.ReactElement {
        switch (state) {
            case "loading":
                return (<>
                    <Button disabled className="flex items-center text-center w-full">
                        <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                        Demande en cours ...
                    </Button>
                </>)

            case "done":
                return (<>
                    <Button className="flex items-center text-center w-full bg-lime-900 text-white">
                        <CircleCheck className="mr-2 h-4 w-4" />
                        Demande envoyée !
                    </Button>
                </>)

            case "error":
                return (<>
                    <Button variant="destructive" className="flex items-center text-center w-full">
                        <CircleX className="mr-2 h-4 w-4" />
                        Erreur lors de la demande
                    </Button>
                </>)

            default:
                return (<></>)

        }
    }

    /***************** RENDER FUNCTION *****************/
    function renderTable(data: any): React.ReactElement[] {

        const element: React.ReactElement[] = []

        element.push(
            <div className="flex gap-4 pb-5" key={0}>
                <Button variant="outline" className="w-2/3" >Titre de la demande</Button >
                <Button variant="outline" className="w-1/3">Etat</Button >
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
                        state = "En livraison"
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

                element.push(
                    <div className="flex gap-4" key={item.id}>
                        <Button variant="ghost" className={`w-2/3 ${color}`} >{item.title.toUpperCase()}
                        </Button >
                        <Button variant="ghost" className={`w-1/3 ${color}`}>{state}
                        </Button >
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
            <div className="flex items-center pb-1 border-b">
                <h1 className="font-semibold text-2xl">DEMANDES D'ACHATS</h1>
            </div>

            <div className="grid md:grid-cols-2 gap-5">

                <div className="border p-10 border-dashed rounded-lg shadow-sm">

                    <div className="flex flex-col gap-1">
                        <h3 className="text-2xl font-bold tracking-tight">
                            Faire une demande d'achats :
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Faites une demande au service achats ici !
                        </p>
                        <p className="text-red-600">/!\ Un element à la fois /!\</p>

                        <br />

                        <form id="mainForm" onSubmit={onSubmit} >

                            <div className="flex flex-1 gap-x-10 flex-col gap-4 grid grid-cols-1">

                                <div className="grid gap-2">
                                    <Label htmlFor="title">Titre de la demande</Label>
                                    <Input
                                        name="title"
                                        value={itemData.title}
                                        onChange={onChange}
                                        type="text"
                                        required />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="link">Lien URL</Label>
                                    <Input
                                        name="link"
                                        value={itemData.link}
                                        onChange={onChange}
                                        type="text"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="quantity">Quantité</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            name="quantity"
                                            value={itemData.quantity}
                                            onChange={onChange}
                                            type="number"
                                            placeholder=""
                                            required />

                                        <Button onClick={() => itemData.quantity > 1 && setItemData({ ...itemData, ["quantity"]: itemData.quantity - 1 })}><SquareMinus /></Button>
                                        <Button onClick={() => setItemData({ ...itemData, ["quantity"]: itemData.quantity + 1 })}><SquarePlus /></Button>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="price">Prix total (en €)</Label>
                                    <Input
                                        name="price"
                                        value={itemData.price}
                                        onChange={onChange}
                                        type="number"
                                        placeholder="0,00€"
                                        required />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="note">Note</Label>
                                    <Textarea
                                        className="h-20"
                                        name="note"
                                        value={itemData.note}
                                        onChange={onChange}
                                        placeholder="" />
                                </div>

                            </div>

                            <Button type="submit" className="w-full mt-5">Envoyer la demande</Button>
                        </form>

                        <div className="flex mt-5">
                            {changeState(submitState)}
                        </div>
                    </div>
                </div>

                <div className="border p-10 border-dashed rounded-lg shadow-sm">

                    <div className="flex flex-col gap-1">
                        <h3 className="text-2xl font-bold tracking-tight">
                            Etat d'avancement :
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Etat de mes demandes.
                        </p>
                        <br />
                        {renderTable(displayList)}
                    </div>
                </div>

            </div>
        </>


    )
}