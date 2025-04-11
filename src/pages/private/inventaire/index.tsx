// ui imports
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@ui/drawer"
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card"
import { Button } from "@ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@ui/sheet"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@ui/input-otp"
import { Label } from "@ui/label"
import { Input } from "@ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/select"

import { EmptyObject, ParseNumberToIsoDate } from "@/_utils/helpers"

import {
    Bolt,
    PartyPopper,
    Drill,
    ScanLine,
    PaintRoller,
    SquarePlus,
    CircleX, CircleCheck, RotateCw
} from "lucide-react"

import { SeeMore, SeeTrigger, SeeList, SeeComponent } from '@layout/SeeMore'

import { useState, useEffect } from "react"


// react frameworks imports
import QrReader from "@components/partials/QrReader";

import { inventoryItemService } from "@/_services/inventoryItem.service"
import { inventoryBufferService } from "@/_services/inventoryBuffer.service"
import { accountService } from "@/_services/account.service"
//import ShowList from "./shows/_showList"
import ToolList from "./tools/_toolList"
import ScrewList from "./screws/_screwList"
import SupplyList from "./supplies/_supplyList"
import SlfxList from "./slfxs/_slfxList"
import BufferList from "./buffer/_bufferList"

import { SuggestionInput } from "@layout/SuggestionInput"

export default function Inventaire() {

    /***************** STATE VARIABLES *****************/
    const queryParameters = new URLSearchParams(window.location.search)
    const [activeSeeItem, setActiveSeeItem] = useState(queryParameters.get("see") || "")

    const [updateBufferTable, setUpdateBufferTable] = useState<boolean>(false)

    const [updateToolTable, setUpdateToolTable] = useState<boolean>(false)
    const [updateScrewTable, setUpdateScrewTable] = useState<boolean>(false)
    const [updateSupplyTable, setUpdateSupplyTable] = useState<boolean>(false)
    const [updateSlfxTable, setUpdateSlfxTable] = useState<boolean>(false)
    const [tableToUpdate, setTableToUpdate] = useState<string>("")

    const [drawerOpen, setDrawerOpen] = useState<boolean>(false) // open trigger for qr code drawer component

    const [sheetOpen, setSheetOpen] = useState<boolean>(false) // open trigger for add item sheet component
    const [submitState, setSubmitState] = useState<string>("") // for spin animation

    const [loadedSuggestionList, setLoadedSuggestionList] = useState([]) // list got from api

    const [itemData, setItemData] = useState({
        brand: "",
        model: "",
        category: "",
        reference: "",
        price: "",
        quantity: "",/*
        minQuantity: "", */
        boughtAt: "",
    })


    /***************** SUBMIT CREDENTIALS TO API *****************/
    useEffect(() => {
        switch (tableToUpdate) {
            case "slfx":
                setUpdateSlfxTable(!updateSlfxTable)
                break
            case "consommables":
                setUpdateSupplyTable(!updateSupplyTable)
                break
            case "outilage":
                setUpdateToolTable(!updateToolTable)
                break
            case "quincaillerie":
                setUpdateScrewTable(!updateScrewTable)
                break
        }
        setTableToUpdate("")

    }, [tableToUpdate])

    const onSubmit = (e: any) => {
        e.preventDefault()
        setSubmitState("loading")

        
        if (itemData.boughtAt.length === 8 || itemData.boughtAt.length === 0) { // empty or filled
            
            let submitedData = { ...itemData } // to clone without affecting display
            if (itemData.boughtAt.length === 8) { // if date not empty => format date
                submitedData.boughtAt = ParseNumberToIsoDate(submitedData.boughtAt) // ISO DATE FORMAT
            }
            
            // remove brand
            if (submitedData.category === "quincaillerie" ){
                submitedData.brand =  ""
            }

            inventoryBufferService.addOne(submitedData)
                .then(() => {
                    setSubmitState("done")
                })
                .then(() => {
                    setUpdateBufferTable(!updateBufferTable)
                })

                .catch(() => {
                    setSubmitState("error")
                })

        }
        else {
            setSubmitState("error")
        }
    }

    /***************** SET DATA INSIDE INPUTS *****************/
    const onChange = (e: any) => {
        setItemData({ ...itemData, [e.target.name]: e.target.value })
    }

    function LoadSuggestionList(categoryName: any) {
        inventoryItemService.getAllModelsFromCategory(categoryName)
            .then((res) => {
                setLoadedSuggestionList(res.data.data)
                //REMOVE setFilteredSuggestionList(res.data.data.slice(0, SUGGESTED_ELEMENTS_NUMBER))
            })
            .catch(() => {
                console.log("error")
            })
    }

    /***************** STATE SUBMIT INFORMATION *****************/
    function changeState(state: string): React.ReactElement {
        switch (state) {
            case "loading":
                return (<>
                    <Button disabled className="flex items-center text-center w-full">
                        <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                        Ajout en cours ...
                    </Button>
                </>)

            case "done":
                return (<>
                    <Button className="flex items-center text-center w-full bg-lime-900 text-white ">
                        <CircleCheck className="mr-2 h-4 w-4" />
                        Item ajouté avec succès !
                    </Button>
                </>)

            case "error":
                return (<>
                    <Button variant="destructive" className="flex items-center text-center w-full">
                        <CircleX className="mr-2 h-4 w-4" />
                        Erreur lors de l'ajout !
                    </Button>
                </>)

            default:
                return (<></>)

        }
    }

    /***************** SEE ITEM FROM SEELIST *****************/
    function updateSeeItem(see: string) {
        const queryParams = new URLSearchParams(window.location.search);
        queryParams.set("see", see);
        history.pushState(null, "", "?" + queryParams.toString())
    }

    return (
        <>

            <div className="flex items-center pb-1 border-b">
                <h1 className="font-semibold text-2xl">INVENTAIRE</h1>
            </div>

            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                <Button
                    className=""
                    onClick={() => {
                        setDrawerOpen(!drawerOpen)
                    }}
                >
                    <ScanLine className="mr-1 hover:animate-spin" />
                    QR Scanner
                </Button>

                <Button
                    className=""
                    onClick={() => {
                        setItemData(EmptyObject(itemData))
                        setSubmitState("")
                        setSheetOpen(!sheetOpen)
                    }}
                    {...accountService.checkRole("inventaire", ["admin"]) ? { disabled: false } : { disabled: true }}
                >
                    <SquarePlus className="mr-1 hover:animate-spin" />
                    Ajouter des items au buffer
                </Button>
            </div>

            {/*** QR CODE DRAWER ***/}
            <Drawer open={drawerOpen} >
                <DrawerContent className="max-h-screen mt-10">

                    <DrawerHeader className="sm:pl-10">
                        <DrawerTitle>QR Scanner</DrawerTitle>
                        <DrawerDescription>Scannez un qr code pour voir ses détails.</DrawerDescription>
                    </DrawerHeader>

                    <div className="overflow-auto">
                        <div className="flex items-center justify-center">
                            {<QrReader />}
                        </div>
                    </div>
                    <Button
                        className="items-center justify-center m-4"
                        onClick={() => setDrawerOpen(!drawerOpen)}
                        variant="destructive">
                        Fermer
                    </Button>

                </DrawerContent>
            </Drawer>

            {/*** ADD ITEM SHEET ***/}
            <Sheet open={sheetOpen} onOpenChange={() => { setSheetOpen(!sheetOpen) }}>
                <SheetContent className="pt-10 w-screen overflow-auto md:w-auto" side="right">
                    <SheetHeader>
                        <SheetTitle>Ajouter un item :</SheetTitle>
                        <SheetDescription>Ajoute un item au buffer.</SheetDescription>
                    </SheetHeader>

                    <form id="mainForm" onSubmit={onSubmit} className="pt-10 grid gap-5">

                        <div className="grid gap-2">
                            <Label htmlFor="category">Catégorie</Label>
                            <Select
                                defaultValue={""}
                                onValueChange={
                                    (selectedValue) => {
                                        setItemData(EmptyObject(itemData))
                                        setItemData(itemData => ({ ...itemData, ["category"]: selectedValue }))
                                        switch (selectedValue) {
                                            case "outillage":
                                                setItemData(itemData => ({ ...itemData, ["quantity"]: "1" }))
                                                LoadSuggestionList(selectedValue)
                                                break
                                            case "slfx":
                                                setItemData(itemData => ({ ...itemData, ["quantity"]: "1" }))
                                                LoadSuggestionList(selectedValue)
                                                break
                                            case "quincaillerie":
                                                LoadSuggestionList(selectedValue)
                                                break
                                            case "consommables":
                                                LoadSuggestionList(selectedValue)
                                                break
                                        }
                                    }
                                }>

                                <SelectTrigger>
                                    <SelectValue placeholder={itemData.category} />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="outillage">Outillage</SelectItem>
                                    <SelectItem value="quincaillerie">Quincaillerie</SelectItem>
                                    <SelectItem value="consommables">Consommables</SelectItem>
                                    <SelectItem value="slfx">Son / lumière / FX</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {itemData.category === "" ?
                            <></> :
                            <>
                                <div className="grid gap-2 pb-0 mb-0">
                                    <Label htmlFor="model">Modèle</Label>

                                    <SuggestionInput
                                        required
                                        name="model"
                                        inputValue={itemData.model}
                                        onChange={(value: any) => setItemData({ ...itemData, ["model"]: value })}
                                        suggestedNumber={5}
                                        options={loadedSuggestionList}
                                        searchObjectName="model"
                                        displayObjectName="model"
                                        onMouseDownItem={(item: any) => {
                                            console.log("CLICKED", item)
                                            setItemData(itemData => ({ ...itemData, ["model"]: item.model })) // auto fill model
                                            setItemData(itemData => ({ ...itemData, ["brand"]: item.brand })) // auto fill brand

                                            if (itemData.category === "quincaillerie" || itemData.category === "consommables") {
                                                setItemData(itemData => ({ ...itemData, ["reference"]: item.reference })) // auto fill reference
                                            }
                                        }}
                                    />
                                </div>

                                {
                                    itemData.category === "quincaillerie" ?
                                        <></>
                                        :
                                        <div className="grid gap-2">
                                            <Label htmlFor="brand">Marque</Label>
                                            <Input
                                                value={itemData.brand}
                                                onChange={onChange}
                                                name="brand"
                                                type="text"
                                                required />
                                        </div>
                                }

                                <div className="grid gap-2">
                                    {itemData.category === "outillage" || itemData.category === "slfx" ?
                                        <Label htmlFor="reference">Numéro de série</Label>
                                        :
                                        <Label htmlFor="reference">Reference</Label>
                                    }
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
                                        {...(itemData.category === "outillage" || itemData.category === "slfx") ? { readOnly: true } : { readOnly: false }}
                                        autoComplete="off"
                                        value={itemData.quantity}
                                        onChange={onChange}
                                        name="quantity"
                                        type="number" />
                                </div>

                                {/*itemData.category === "outillage" || itemData.category === "slfx" ?
                                    <></> :
                                    <div className="grid gap-2">
                                        <Label htmlFor="minQuantity">Quantité minimale</Label>
                                        <Input
                                            autoComplete="off"
                                            value={itemData.minQuantity}
                                            onChange={onChange}
                                            name="minQuantity"
                                            type="number" />
                                    </div>*/
                                }

                                <div className="grid gap-2">
                                    <Label htmlFor="price">Prix d'achat (€)</Label>
                                    <Input
                                        autoComplete="off"
                                        value={itemData.price}
                                        onChange={onChange}
                                        name="price"
                                        placeholder="0,00€"
                                        type="number" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="boughtAt">Date d'achat</Label>
                                    <InputOTP
                                        value={itemData.boughtAt}
                                        onChange={(newValue) => setItemData(itemData => ({ ...itemData, ["boughtAt"]: newValue }))}
                                        name="boughtAt"
                                        maxLength={8}
                                    >
                                        <InputOTPGroup  >
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

                                <div className="flex mt-5" >
                                    <Button type="submit" className="flex flex-col w-2/3 items-center gap-1 text-center">Ajouter</Button>
                                    <Button variant="destructive"
                                        onClick={() => setSheetOpen(!sheetOpen)}
                                        className="flex flex-col ml-5 py-4 items-center text-center w-1/3"> Annuler </Button>
                                </div>
                            </>
                        }
                    </form>

                    <div className="flex mt-5">
                        {changeState(submitState)}
                    </div>
                </SheetContent>
            </Sheet >

            {/*** BUFFER LIST ***/}
            <BufferList updateTableTrigger={updateBufferTable} updateOutsideTable={setTableToUpdate} />

            {/*** SEE MORE COMPONENT ***/}
            <SeeMore defaultValue={activeSeeItem}>

                <SeeList className="pb-5 gap-4 grid grid-cols-1 md:grid-cols-2 border-b border-dashed">
                    <SeeTrigger value="a" onClick={() => updateSeeItem("a")}>
                        <Card className={activeSeeItem === "a" ? "bg-muted" : " "} onClick={() => { setActiveSeeItem("a") }}>
                            <CardHeader className="flex flex-col flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-2xl font-bold"> OUTILLAGE  </CardTitle>
                                <Drill />
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground"> Perceuses, meuleuses, visseuses ... </p>

                            </CardContent>
                        </Card>
                    </SeeTrigger>

                    <SeeTrigger value="b" onClick={() => updateSeeItem("b")}>
                        <Card className={(activeSeeItem === "b" ? "bg-muted" : " ") + ""} onClick={() => { setActiveSeeItem("b") }}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-2xl font-bold"> QUINCAILLERIE </CardTitle>
                                <Bolt />
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground"> Vis, écrous rondelles ... </p>
                            </CardContent>
                        </Card>
                    </SeeTrigger>

                    <SeeTrigger value="c" onClick={() => updateSeeItem("c")}>
                        <Card className={activeSeeItem === "c" ? "bg-muted" : " "} onClick={() => { setActiveSeeItem("c") }}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-2xl font-bold"> CONSOMMABLES </CardTitle>
                                <PaintRoller />
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground"> Gants, lames, mastic colle, disques ... </p>
                            </CardContent>
                        </Card>
                    </SeeTrigger>

                    <SeeTrigger value="d" onClick={() => updateSeeItem("d")}>
                        <Card className={activeSeeItem === "d" ? "bg-muted" : " "} onClick={() => { setActiveSeeItem("d") }}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-2xl font-bold"> SON / LUMIERE / FX </CardTitle>
                                <PartyPopper />
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground"> Enceintes, projecteurs, lyres ... </p>
                            </CardContent>
                        </Card>
                    </SeeTrigger>
                </SeeList>

                <SeeComponent value="a">
                    <ToolList updateTableTrigger={updateToolTable} />
                </SeeComponent>

                <SeeComponent value="b">
                    <ScrewList updateTableTrigger={updateScrewTable} />
                </SeeComponent>

                <SeeComponent value="c">
                    <SupplyList updateTableTrigger={updateSupplyTable} />
                </SeeComponent>

                <SeeComponent value="d">
                    <SlfxList updateTableTrigger={updateSlfxTable} />
                </SeeComponent>

            </SeeMore >



        </>
    )
}
