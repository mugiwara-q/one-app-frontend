import { Button } from "@ui/button"
import { Input } from "@ui/input"
import { Label } from "@ui/label"
import { Textarea } from "@ui/textarea"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@ui/dropdown-menu"

import {
    Ellipsis,
    Truck,
    Eye,
    SquareMinus
} from "lucide-react"

import { Separator } from "@ui/separator"

import { RotateCw, CircleX, CircleCheck } from "lucide-react"

import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from "react"

import Error from "@utils/error"
import { UpperFirstLetter } from "@utils/helpers"

import { showService } from "@/_services/show.service"
import { machineService } from "@/_services/machine.service"
import { accountService } from "@/_services/account.service"

export default function DetailsShow() {

    /***************** SET CREDENTIALS *****************/
    const queryParameters = new URLSearchParams(window.location.search)
    const isEdit = queryParameters.get("isEdit")
    const id = queryParameters.get("id")
    const flag = useRef(false)
    const [displayError, setDisplayError] = useState(false)
    const [submitState, setSubmitState] = useState("")
    const [showMachineList, setShowMachineList] = useState([])
    const [editableState, setEditableState] = useState(false)

    const [unactiveMachineList, setUnactiveMachineList] = useState([])
    const [unactiveMachineListFiltered, setUnactiveMachineListFiltered] = useState([])
    const [displayFilter, setDisplayFilter] = useState("")

    const [makeUpdate, setMakeUpdate] = useState(false)

    const [showData, setshowData] = useState({
        name: "",
        objectNumber: "",
        price: "",
        showDurationInMin: "",
        assemblyDurationInHours: "",
        details: "",
    })

    const [displayMachineSuggestions, setDisplayMachineSuggestions] = useState(false)

    /***************** LOAD INPUT *****************/
    // Get user on display
    useEffect(() => {
        if (flag.current === false) {
            if (isEdit === "true") { // EDIT
                setEditableState(true)
            }

            else if (isEdit === "false") { // SHOW
                setEditableState(false)
            }

            else { // ADD
                setEditableState(true)
            }

            if ((isEdit === "true" || isEdit === "false") && id !== null && !isNaN(parseInt(id))) { // EDIT OR SHOW
                showService.getOne(id)
                    .then(res => {
                        (document.getElementById("mainForm") as HTMLFormElement).reset()
                        Object.keys(res.data.data).forEach(function (key) {
                            (res.data.data[key] === null || res.data.data[key] === undefined) ?
                                setshowData(showData => ({ ...showData, [key]: "" })) :
                                setshowData(showData => ({ ...showData, [key]: res.data.data[key] }))
                        })
                    })
                    .catch(() => setDisplayError(true))

                machineService.getAllFromShow(id)
                    .then(res => {
                        setShowMachineList(res.data.data)
                    })
                    .catch(() => setDisplayError(true))

                machineService.getAllUnactive()
                    .then(res => {
                        setUnactiveMachineList(res.data.data)
                        setUnactiveMachineListFiltered(res.data.data)
                    })
                    .catch(() => setDisplayError(true))
            }

        }

        return () => { flag.current = true }
    }, [])

    useEffect(() => {
        if (id !== null && !isNaN(parseInt(id))) {
            machineService.getAllFromShow(id)
                .then(res => {
                    console.log(res.data.data)
                    setShowMachineList(res.data.data)
                })
                .catch(() => setDisplayError(true))
        }

        machineService.getAllUnactive()
            .then(res => {
                setUnactiveMachineList(res.data.data)
                setUnactiveMachineListFiltered(res.data.data)
            })
            .catch(() => setDisplayError(true))

    }, [makeUpdate])

    /***************** FILTER MACHINES FROM INPUTS *****************/
    function onChangeFilter(e: any) {
        setDisplayFilter(e.target.value)

        if (e.target.value !== "") {
            setUnactiveMachineListFiltered(unactiveMachineList.filter((obj: any) =>
                obj.name.includes(e.target.value.toLowerCase())
            ))
        }

        else {
            setUnactiveMachineListFiltered(unactiveMachineList)
        }
    }

    /***************** SET CREDENTIALS INSIDE INPUTS *****************/
    const onChange = (e: any) => {
        setshowData({
            ...showData,
            [e.target.name]: e.target.value
        })
    }

    /***************** SUBMIT CREDENTIALS TO API *****************/
    const onSubmit = (e: any) => {
        e.preventDefault()
        setSubmitState("loading")

        if (id === null || isNaN(parseInt(id))) { // add
            showService.addOne(showData)
                .then(() => {
                    setSubmitState("done")
                })
                .catch(() => {
                    setSubmitState("error")
                })
        }
        else { // edit
            showService.editOne(id, showData)
                .then(() => {
                    setSubmitState("done")
                })
                .catch(() => {
                    setSubmitState("error")
                })
        }

    }

    /***************** LINKS *****************/
    let navigate = useNavigate()
    const cancelLink = () => {
        navigate("../administratif")
    }

    function dissociateMachine(mid: number) {
        machineService.editOne(mid, { showId: null }).then(() => setMakeUpdate(!makeUpdate))
    }

    function associateMachine(mid: number, showId: string | null) {
        console.log("HA")
        machineService.editOne(mid, { showId: showId }).then(() => setMakeUpdate(!makeUpdate))
    }

    function detailsLink(uid: string): string {
        return "../machines/detailsMachine?" + "isEdit=false&id=" + uid
    }

    /***************** STATE SUBMIT INFORMATION *****************/
    function changeState(state: string): React.ReactElement {
        switch (state) {
            case "loading":
                return (<>
                    <Button disabled className="flex items-center text-center w-full">
                        <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                        {(id === null || isNaN(parseInt(id))) ?
                            "Ajout en cours ..." :
                            "Modification en cours"}
                    </Button>
                </>)

            case "done":
                return (<>
                    <Button className="flex items-center text-center w-full bg-lime-900 text-white ">
                        <CircleCheck className="mr-2 h-4 w-4" />
                        {(id === null || isNaN(parseInt(id))) ?
                            "Spectacle ajouté avec succès !" :
                            "Spectacle modifié avec succès !"}
                    </Button>
                </>)

            case "error":
                return (<>
                    <Button variant="destructive" className="flex items-center text-center w-full">
                        <CircleX className="mr-2 h-4 w-4" />
                        {(id === null || isNaN(parseInt(id))) ?
                            "Erreur lors de l'ajout !" :
                            "Erreur lors de la modification"}
                    </Button>
                </>)

            default:
                return (<></>)

        }
    }

    if ((isEdit === "true" || isEdit === "false") && displayError === true) { // SHOW
        return <Error />
    }

    /***************** TOTAL FUNCTION *****************/
    function getTotal(countType: string, object: any): number {
        switch (countType) {
            case "operator":
                return object.reduce((total: any, obj: any) => obj.operatorCount + total, 0)

            case "driver":
                return object.reduce((total: any, obj: any) => obj.driverCount + total, 0)

            case "artist":
                return object.reduce((total: any, obj: any) => obj.artistCount + total, 0)

            default:
                return 0
        }

    }

    /***************** RENDER FUNCTIONS *****************/
    function renderUnactiveMachineList(displayList: any): React.ReactElement[] {
        const element: React.ReactElement[] = []

        if (displayList.length > 0) {
            displayList.map((item: any) => {
                element.push(
                    <Button onClick={() => associateMachine(item.id, id)}
                        onMouseDown={(e) => {
                            e.preventDefault()
                        }}
                        key={item.id} size="icon" variant="outline" className="justify-between text-left w-full pl-5 mb-1">
                        {UpperFirstLetter(item.name)}
                    </Button>
                )
            })
        }
        else { element.push(<div key="0" className="flex flex-1 p-4">Aucun engin dissocié</div>) }
        return element
    }

    function renderShowMachineList(displayList: any): React.ReactElement[] {
        const element: React.ReactElement[] = []

        if (displayList.length > 0) {
            displayList.map((item: any) => {
                element.push(
                    <div key={item.id} >
                        <div className="grid gap-3">
                            <div className="flex flex-row">

                                <div className="w-full flex items-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="icon" variant="outline" className="w-full gap-4">
                                                <Ellipsis className="h-3 w-3" />
                                                {UpperFirstLetter(item.name)}
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="start">
                                            <DropdownMenuItem><Link className="flex" to={detailsLink(item.id)}> <Eye className="mr-4" /> Consulter les détails </Link></DropdownMenuItem>
                                            {editableState === true ?
                                                <>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="flex" onClick={() => dissociateMachine(item.id)}> <SquareMinus className="mr-4" /> Supprimer / Dissocier</DropdownMenuItem>
                                                </>
                                                : <></>}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                            </div>

                            <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    Manipulateurs
                                </span> <span>x{item.operatorCount || 0}</span>
                            </li>

                            <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    Conducteurs
                                </span> <span>x{item.driverCount || 0}</span>
                            </li>

                            <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    Artistes
                                </span> <span>x{item.artistCount || 0}</span>
                            </li>
                        </div>
                        <Separator className="my-4" />
                    </div>
                )

            })
        }

        else { element.push(<div key="0" className="flex flex-1 p-4 mb-4 rounded-lg border border-dashed">Aucun engin associé !</div>) }
        return element
    }

    /***************** RETURN FUNCTION *****************/

    return (
        <>
            <div className="flex items-center pb-1 border-b">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link className="font-semibold text-2xl" to="../administratif">SPECTACLES</Link >
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />

                        <BreadcrumbItem>
                            {((isEdit === "true" || isEdit === "false") && id !== null && !isNaN(parseInt(id))) ?
                                <Link to="" className="font-semibold text-2xl text-primary">{editableState === true ? "Modifier un spectacle" : "Consulter un spectacle"} </Link> :
                                <Link to="" className="font-semibold text-2xl text-primary">Ajouter un spectacle </Link>
                            }
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div >

            <form id="mainForm" onSubmit={onSubmit}>
                <div className={`md:gap-x-5 ${!(id === null || isNaN(parseInt(id))) && "md:flex"}`} >
                    <div className={`flex flex-col p-10 border border-solid rounded-lg shadow-sm ${(id === null || isNaN(parseInt(id))) ? "" : "md:w-2/3"}`}>

                        {(id === null || isNaN(parseInt(id))) ?
                            <>
                                <h2 className="text-2xl font-bold tracking-tight">
                                    Nouveau spectacle :
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Ajouter un spectacle
                                </p>
                            </>
                            :
                            <>
                                <h2 className="text-2xl font-bold tracking-tight">
                                    {showData.name.charAt(0).toUpperCase() + showData.name.slice(1) + ":"}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Consulter les détails du spectacle
                                </p>
                            </>
                        }

                        <br />

                        <div className="flex gap-x-5 flex-col gap-4 grid grid-cols-1 lg:grid-cols-2">

                            <div className="grid gap-2 lg:col-span-2">
                                <Label htmlFor="name">Nom du spectacle</Label>
                                <Input
                                    {...editableState === true ? { disabled: false } : { disabled: true }}
                                    name="name"
                                    value={showData.name}
                                    onChange={onChange}
                                    type="text"
                                    required />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="objectNumber">Numéro d'objet</Label>
                                <Input
                                    {...editableState === true ? { disabled: false } : { disabled: true }}
                                    name="objectNumber"
                                    value={showData.objectNumber}
                                    onChange={onChange}
                                    type="text"
                                    required />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="price">Prix du spectacle (en €)</Label>
                                <Input
                                    {...editableState === true ? { disabled: false } : { disabled: true }}
                                    name="price"
                                    value={showData.price}
                                    onChange={onChange}
                                    type="number"
                                    required />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="showDurationInMin">Durée du spectacle (en minutes)</Label>
                                <Input
                                    {...editableState === true ? { disabled: false } : { disabled: true }}
                                    name="showDurationInMin"
                                    value={showData.showDurationInMin}
                                    onChange={onChange}
                                    type="number"
                                    required />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="assemblyDurationInHours">Temps de montage / démontage (en heures)</Label>
                                <Input
                                    {...editableState === true ? { disabled: false } : { disabled: true }}
                                    name="assemblyDurationInHours"
                                    value={showData.assemblyDurationInHours}
                                    onChange={onChange}
                                    type="number"
                                    required />
                            </div>

                            <div className="grid gap-2 lg:col-span-2">
                                <Label htmlFor="details">Details</Label>
                                <Textarea
                                    {...editableState === true ? { disabled: false } : { disabled: true }}
                                    className="h-40"
                                    name="details"
                                    value={showData.details}
                                    onChange={onChange}
                                    placeholder="" />
                            </div>
                        </div>

                    </div>

                    <Card className={`flex flex-col mt-10 md:mt-0 ${(id === null || isNaN(parseInt(id))) ? "hidden" : "md:w-1/3"}`}>

                        <CardHeader className="flex flex-row items-start bg-muted/50">
                            <div className="grid gap-1">
                                <CardTitle className="group flex items-center gap-2 text-lg">
                                    <Truck className="h-5 w-5" />
                                    Engins associés :
                                </CardTitle>
                                <CardDescription>{getTotal("operator", showMachineList)} Manipulateurs</CardDescription>
                                <CardDescription>{getTotal("driver", showMachineList)} Conducteurs</CardDescription>
                                <CardDescription>{getTotal("artist", showMachineList)} Artistes</CardDescription>
                            </div>
                        </CardHeader>

                        <CardContent className="px-6 py-4 text-sm">
                            {!!showMachineList ? renderShowMachineList(showMachineList) : ""}
                        </CardContent>

                        {editableState === true ?
                            <>
                                <div className="border-t bg-muted/50 px-6 py-3">
                                    <Input
                                        className="mb-3"
                                        placeholder="Ajouter un engin ..."
                                        value={displayFilter}
                                        onChange={onChangeFilter}
                                        onFocus={() => setDisplayMachineSuggestions(true)}
                                        onBlur={() => setDisplayMachineSuggestions(false)}
                                    />

                                    {displayMachineSuggestions ? renderUnactiveMachineList(unactiveMachineListFiltered) : <></>}
                                </div>
                            </>

                            : <></>
                        }

                    </Card>
                </div>

                <div className={`flex mt-5 ${editableState === true ? "" : "hidden"}`} >

                    {(id === null || isNaN(parseInt(id))) ?
                        <>
                            <Button type="submit" className="flex flex-col w-2/3 items-center gap-1 text-center">Ajouter le spectacle</Button>
                            <Button variant="destructive" onClick={() => cancelLink()} className="flex flex-col ml-5 py-4 items-center text-center w-1/3 "> Annuler </Button>
                        </> :
                        <>
                            <Button type="submit" className="flex flex-col w-2/3 items-center gap-1 text-center">Enregistrer les modifications</Button>
                            <Button type="button" variant="destructive"
                                onClick={() => {
                                    setEditableState(false)
                                    setSubmitState("")
                                }}
                                className="flex flex-col ml-5 py-4 items-center text-center w-1/3 ">
                                {submitState === "done" ? "Retour" : "Annuler les modifications"}
                            </Button>
                        </>}
                </div>

            </form >

            <div className={`flex ${editableState === true ? "hidden" : ""}`} >
                <Button {...accountService.checkRole("administratif", ["w"]) ? { disabled: false } : { disabled: true }}
                    onClick={() => setEditableState(true)} variant="secondary" className="flex flex-col w-1/2 items-center gap-1 text-center">Modifier le spectacle</Button>
                <Button type="button" onClick={() => cancelLink()} className="flex flex-col ml-5 py-4 items-center text-center w-1/2 "> Retour </Button>
            </div>

            <div className="flex">
                {changeState(submitState)}
            </div>

        </>
    )
}