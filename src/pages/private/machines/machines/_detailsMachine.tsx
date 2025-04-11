import { Button } from "@ui/button"
import { Input } from "@ui/input"
import { Label } from "@ui/label"
import { Textarea } from "@ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/select"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@ui/breadcrumb"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@ui/input-otp"

import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from "react"

import Error from "@utils/error"
import { UpperFirstLetter, ParseNumberToIsoDate, ParseIsoDateToNumber } from "@/_utils/helpers"
import { commonDetails } from "../common"

import { vehicleTypeService } from "@/_services/vehicleType.service"
import { machineService } from "@/_services/machine.service"
import { accountService } from "@/_services/account.service"


export default function DetailsMachine() {

    /***************** SET CREDENTIALS *****************/
    const queryParameters = new URLSearchParams(window.location.search)
    const isEdit = queryParameters.get("isEdit")
    const id = queryParameters.get("id")
    const flag = useRef(false)
    const [displayError, setDisplayError] = useState(false)
    const [submitState, setSubmitState] = useState("")
    const [editableState, setEditableState] = useState(false)

    const [vehicleTypes, setVehicleTypes]: any = useState({})
    const [vehicleTypesDisplay, setVehicleTypesDisplay]: any = useState()
    const MACHINE_CATEGORY = "machine"

    const [vehicleData, setVehicleData] = useState({
        showId: "",
        name: "",
        height: "",
        length: "",
        width: "",
        weight: "",
        builtAt: "",
        typeId: "",

        primaryFuel: "",
        secondaryFuel: "",
        operatorCount: "",
        driverCount: "",
        artistCount: "",
        note: "",
    })

    /***************** SET DATA INSIDE INPUT *****************/
    // Get user on display
    useEffect(() => {
        if (flag.current === false) {

            // GET ALL VEHICLES TYPES
            vehicleTypeService.getAll()
                .then(res => {
                    setVehicleTypes(res.data.data)
                    setVehicleTypesDisplay(commonDetails.PopulateVehicleTypes(res.data.data, MACHINE_CATEGORY, "Aucun engin pour le moment !"))
                })

            if (isEdit === "true") { // EDIT
                setEditableState(true)
            }

            else if (isEdit === "false") { // SHOW
                setEditableState(false)
            }

            else { // ADD
                setEditableState(true)
            }

            // POPULATE ON "EDIT" OR "SHOW"
            if ((isEdit === "true" || isEdit === "false") && id !== null && !isNaN(parseInt(id))) {
                machineService.getOne(id)
                    .then(res => {
                        (document.getElementById("mainForm") as HTMLFormElement).reset()
                        Object.keys(res.data.data).forEach(function (key) {
                            (res.data.data[key] === null || res.data.data[key] === undefined) ?
                                setVehicleData(vehicleData => ({ ...vehicleData, [key]: "" })) :
                                (key === "builtAt") ?
                                    setVehicleData(vehicleData => ({ ...vehicleData, [key]: ParseIsoDateToNumber(res.data.data[key]) }))
                                    :
                                    setVehicleData(vehicleData => ({ ...vehicleData, [key]: res.data.data[key] }))
                        })
                    })
                    .catch(() => setDisplayError(true))
            }

        }

        return () => { flag.current = true }
    }, [])

    /***************** SET CREDENTIALS INSIDE INPUTS *****************/
    const onChange = (e: any) => {
        setVehicleData({
            ...vehicleData,
            [e.target.name]: e.target.value
        })
    }

    /***************** SUBMIT CREDENTIALS TO API *****************/
    const onSubmit = (e: any) => {
        e.preventDefault()
        setSubmitState("loading")

        if (vehicleData.builtAt.length === 8 || vehicleData.builtAt.length === 0) { // empty or filled

            let submitedData = { ...vehicleData } // to clone without affecting display
            if (vehicleData.builtAt.length === 8) { // if date not empty => format date
                submitedData.builtAt = ParseNumberToIsoDate(submitedData.builtAt) // ISO DATE FORMAT
            }

            if (id === null || isNaN(parseInt(id))) { // add
                machineService.addOne(submitedData)
                    .then(() => {
                        setSubmitState("done")
                    })
                    .catch(() => {
                        setSubmitState("error")
                    })
            }
            else { // edit
                machineService.editOne(id, submitedData)
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

    /***************** CANCEL LINK *****************/
    let navigate = useNavigate()
    const cancelLink = () => {
        navigate("../machines")
    }
    const backLink = () => {
        navigate(-1)
    }

    if ((isEdit === "true" || isEdit === "false") && displayError === true) { // SHOW ERROR
        return <Error />
    }

    return (
        <>
            <div className="flex items-center pb-1 border-b">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link className="font-semibold text-2xl" to="../machines">MACHINES</Link >
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />

                        <BreadcrumbItem>
                            {((isEdit === "true" || isEdit === "false") && id !== null && !isNaN(parseInt(id))) ?
                                <Link to="" className="font-semibold text-2xl text-white">{editableState === true ? "Modifier un engin" : "Consulter un engin"} </Link> :
                                <Link to="" className="font-semibold text-2xl text-white">Ajouter un engin </Link>
                            }
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div >

            <div className="border p-10 border-solid rounded-lg shadow-sm">

                {(id === null || isNaN(parseInt(id))) ?
                    <>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Nouvel engin :
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Ajouter un engin
                        </p>
                    </>
                    :
                    <>
                        <h2 className="text-2xl font-bold tracking-tight">
                            {UpperFirstLetter(vehicleData.name)
                                + (!!vehicleData.driverCount ? " - " + vehicleData.driverCount + " conducteur.s" : "")
                                + (!!vehicleData.operatorCount ? " / " + vehicleData.operatorCount + " manipulateur.s" : "")
                                + (!!vehicleData.artistCount ? " / " + vehicleData.artistCount + " artiste.s" : "")
                                + " :"}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Consulter les détails de l'engin
                        </p>
                    </>
                }

                <br />

                <form id="mainForm" onSubmit={onSubmit}>

                    <div className="flex flex-1 justify-center">

                        <div className="flex flex-1 gap-x-10 flex-col gap-4 grid grid-cols-1 lg:grid-cols-2">

                            <div className="grid gap-2">

                                <Label htmlFor="type">Type</Label>
                                {
                                    vehicleData.typeId.toString() !== "" || (isEdit !== "true" && isEdit !== "false") ? // TO RENDER ONLY WHEN GOT DATA
                                        <Select
                                            defaultValue={vehicleData.typeId.toString()}
                                            onValueChange={(typeId) => setVehicleData(vehicleData => ({ ...vehicleData, ["typeId"]: typeId }))}
                                            {...editableState === true ? { disabled: false } : { disabled: true }}
                                            required
                                        >

                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={vehicleTypes.length === 0 ? UpperFirstLetter(vehicleTypes.find((obj: any) => obj.id === parseInt(vehicleData.typeId)).type) : " "}
                                                />
                                            </SelectTrigger>

                                            <SelectContent >
                                                {vehicleTypesDisplay}
                                            </SelectContent>
                                        </Select>
                                        : <></>
                                }
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="category">Catégorie</Label>
                                {Object.keys(vehicleTypes).length === 0 ? // empty object
                                    <></> // return nothing
                                    :
                                    <Input
                                        disabled
                                        name="category"
                                        value={vehicleData.typeId !== "" ? UpperFirstLetter(vehicleTypes.find(function (obj: any) { return obj.id === parseInt(vehicleData.typeId) }).category) : ""}
                                        type="text"
                                        required />
                                }
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name"> Nom </Label>
                                <Input
                                    {...editableState === true ? { disabled: false } : { disabled: true }}
                                    name="name"
                                    value={UpperFirstLetter(vehicleData.name)}
                                    onChange={onChange}
                                    type="text"
                                    required />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="builtAt">Date de fabrication</Label>
                                <InputOTP
                                    {...editableState === true ? { disabled: false } : { disabled: true }}
                                    value={vehicleData.builtAt}
                                    onChange={(newValue) => setVehicleData(vehicleData => ({ ...vehicleData, ["builtAt"]: newValue }))}
                                    name="builtAt"
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

                            <div className="grid gap-2">
                                <Label htmlFor="width">Largeur (en mètres)</Label>
                                <Input
                                    {...editableState === true ? { disabled: false } : { disabled: true }}
                                    name="width"
                                    value={vehicleData.width}
                                    onChange={onChange}
                                    type="number"
                                    required />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="length">Longueur (en mètres)</Label>
                                <Input
                                    {...editableState === true ? { disabled: false } : { disabled: true }}
                                    name="length"
                                    value={vehicleData.length}
                                    onChange={onChange}
                                    type="number"
                                    required />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="height">Hauteur (en mètres)</Label>
                                <Input
                                    {...editableState === true ? { disabled: false } : { disabled: true }}
                                    name="height"
                                    value={vehicleData.height}
                                    onChange={onChange}
                                    type="number"
                                    required />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="weight">Poids (en tonnes)</Label>
                                <Input
                                    {...editableState === true ? { disabled: false } : { disabled: true }}
                                    name="weight"
                                    value={vehicleData.weight}
                                    onChange={onChange}
                                    type="number"
                                    required />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="primaryFuel">Carburant principal </Label>
                                {
                                    (vehicleData.primaryFuel) !== undefined || (isEdit !== "true" && isEdit !== "false") ? // TO RENDER ONLY WHEN GOT DATA
                                        <Select
                                            {...editableState === true ? { disabled: false } : { disabled: true }}
                                            required
                                            defaultValue={vehicleData.primaryFuel}
                                            onValueChange={(fuelvalue) => setVehicleData({ ...vehicleData, ["primaryFuel"]: fuelvalue })}>

                                            <SelectTrigger >
                                                <SelectValue placeholder={vehicleData.primaryFuel} />
                                            </SelectTrigger>

                                            <SelectContent>
                                                <SelectItem value="null">-</SelectItem>
                                                <SelectItem value="diesel">Diesel</SelectItem>
                                                <SelectItem value="essence">Essence</SelectItem>
                                                <SelectItem value="electrique">Electrique</SelectItem>
                                                <SelectItem value="gnr">Gasoil non routier</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        : <></>
                                }
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="secondaryFuel">Carburant secondaire </Label>
                                {
                                    (vehicleData.secondaryFuel !== undefined) || (isEdit !== "true" && isEdit !== "false") ? // TO RENDER ONLY WHEN GOT DATA
                                        <Select
                                            {...editableState === true ? { disabled: false } : { disabled: true }}
                                            required
                                            defaultValue={vehicleData.secondaryFuel}
                                            onValueChange={(fuelvalue) => setVehicleData({ ...vehicleData, ["secondaryFuel"]: fuelvalue })}>

                                            <SelectTrigger >
                                                <SelectValue placeholder={vehicleData.secondaryFuel} />
                                            </SelectTrigger>

                                            <SelectContent>
                                                <SelectItem value="null">-</SelectItem>
                                                <SelectItem value="diesel">Diesel</SelectItem>
                                                <SelectItem value="essence">Essence</SelectItem>
                                                <SelectItem value="electrique">Electrique</SelectItem>
                                                <SelectItem value="gnr">Gasoil non routier</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        : <></>
                                }
                            </div>


                            <div className="grid gap-2">
                                <Label htmlFor="driverCount">Nombre de conducteurs </Label>
                                <Input
                                    {...editableState === true ? { disabled: false } : { disabled: true }}
                                    name="driverCount"
                                    value={vehicleData.driverCount}
                                    onChange={onChange}
                                    type="number" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="operatorCount">Nombre de manipulateurs</Label>
                                <Input
                                    {...editableState === true ? { disabled: false } : { disabled: true }}
                                    name="operatorCount"
                                    value={vehicleData.operatorCount}
                                    onChange={onChange}
                                    type="number" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="artistCount">Nombre d'artistes</Label>
                                <Input
                                    {...editableState === true ? { disabled: false } : { disabled: true }}
                                    name="artistCount"
                                    value={vehicleData.artistCount}
                                    onChange={onChange}
                                    type="number" />
                            </div>

                            <div className="grid gap-2 lg:col-span-2">
                                <Label htmlFor="note">Note</Label>
                                <Textarea
                                    {...editableState === true ? { disabled: false } : { disabled: true }}
                                    className="h-20"
                                    name="note"
                                    value={vehicleData.note}
                                    onChange={onChange}
                                    placeholder="" />
                            </div>

                        </div>
                    </div>


                    <div className={`flex mt-10 ${editableState === true ? "" : "hidden"}`} >

                        {(id === null || isNaN(parseInt(id))) ?
                            <>
                                <Button type="submit" className="flex flex-col w-2/3 items-center gap-1 text-center"> Ajouter </Button>
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

                </form>

                <div className={`flex mt-10 ${editableState === true ? "hidden" : ""}`} >
                    <Button {...accountService.checkRole("administratif", ["w"]) ? { disabled: false } : { disabled: true }}
                        onClick={() => setEditableState(true)} variant="secondary" className="flex flex-col w-1/2 items-center gap-1 text-center"> Modifier</Button>
                    <Button type="button" onClick={() => backLink()} className="flex flex-col ml-5 py-4 items-center text-center w-1/2 "> Retour </Button>
                </div>


                <div className="flex mt-5">
                    {commonDetails.ChangeSubmitState(submitState, id)}
                </div>

            </div >


        </>
    )
}