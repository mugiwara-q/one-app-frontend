import { Button } from "@ui/button"
import { Input } from "@ui/input"
import { Label } from "@ui/label"
import { Textarea } from "@ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/select"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@ui/breadcrumb"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@ui/input-otp"

import { Link } from "react-router-dom"
import { useEffect, useState, useRef } from "react"

import Error from "@utils/error"
import { UpperFirstLetter, ParseNumberToIsoDate, ParseIsoDateToNumber } from "@utils/helpers"
import { commonDetails } from "../common"

import { vehicleTypeService } from "@/_services/vehicleType.service"
import { vehicleService } from "@/_services/vehicle.service"
import { accountService } from "@/_services/account.service"


export default function DetailsVehicle() {

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
    const MACHINE_CATEGORY = "equipement"

    const [vehicleData, setVehicleData] = useState({
        brand: "",
        model: "",
        circulationDate: "",
        safetyInspectionDate: "",
        height: "",
        length: "",
        width: "",
        fuel: "",
        licencePlate: "",
        typeId: "",
        seatCount: "",
        axleCount: "",
        colour: "",
        PTAC: "",
        tyre: "",
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
                    setVehicleTypesDisplay(commonDetails.PopulateVehicleTypes(res.data.data, MACHINE_CATEGORY, "Aucun vehicule pour le moment !"))
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
                vehicleService.getOne(id)
                    .then(res => {
                        (document.getElementById("mainForm") as HTMLFormElement).reset()
                        Object.keys(res.data.data).forEach(function (key) {
                            (res.data.data[key] === null || res.data.data[key] === undefined) ?
                                setVehicleData(vehicleData => ({ ...vehicleData, [key]: "" })) :
                                (key === "circulationDate" || key == "safetyInspectionDate") ?
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

        if ((vehicleData.circulationDate.length === 8 || vehicleData.circulationDate.length === 0) ||
            (vehicleData.safetyInspectionDate.length === 8 || vehicleData.safetyInspectionDate.length === 0)) { // empty or filled

            let submitedData = { ...vehicleData } // to clone without affecting display

            if (vehicleData.safetyInspectionDate.length === 8) { // if date not empty => format date
                submitedData.safetyInspectionDate = ParseNumberToIsoDate(submitedData.safetyInspectionDate) // ISO DATE FORMAT
            }

            if (vehicleData.circulationDate.length === 8) { // if date not empty => format date
                submitedData.circulationDate = ParseNumberToIsoDate(submitedData.circulationDate) // ISO DATE FORMAT
            }

            if (id === null || isNaN(parseInt(id))) { // add
                vehicleService.addOne(submitedData)
                    .then(() => {
                        setSubmitState("done")
                    })
                    .catch(() => {
                        setSubmitState("error")
                    })
            }
            else { // edit
                vehicleService.editOne(id, submitedData)
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

    if ((isEdit === "true" || isEdit === "false") && displayError === true) { // SHOW
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
                                <Link to="" className="font-semibold text-2xl text-white">{editableState === true ? "Modifier un engin de manutention" : "Consulter un engin de manutention"} </Link> :
                                <Link to="" className="font-semibold text-2xl text-white">Ajouter un engin de manutention </Link>
                            }
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div >

            <div className="border p-10 border-solid rounded-lg shadow-sm">

                {(id === null || isNaN(parseInt(id))) ?
                    <>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Nouvel engin de manutention :
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Ajouter un engin de manutention
                        </p>
                    </>
                    :
                    <>
                        <h2 className="text-2xl font-bold tracking-tight">
                            {UpperFirstLetter(vehicleData.brand) + " " + vehicleData.model + " - " + vehicleData.seatCount + " places :"}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Consulter les détails de la machine
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
                                <Label htmlFor="brand">Marque </Label>
                                <Input
                                    {...editableState === true ? { disabled: false } : { disabled: true }}
                                    name="brand"
                                    value={UpperFirstLetter(vehicleData.brand)}
                                    onChange={onChange}
                                    type="text"
                                    required />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="model">Modèle </Label>
                                <Input
                                    {...editableState === true ? { disabled: false } : { disabled: true }}
                                    name="model"
                                    value={UpperFirstLetter(vehicleData.model)}
                                    onChange={onChange}
                                    type="text"
                                    required />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="circulationDate">Date de mise en circulation</Label>
                                <InputOTP
                                    {...editableState === true ? { disabled: false } : { disabled: true }}
                                    value={vehicleData.circulationDate}
                                    onChange={(newValue) => setVehicleData(vehicleData => ({ ...vehicleData, ["circulationDate"]: newValue }))}
                                    name="circulationDate"
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
                                <Label htmlFor="safetyInspectionDate">Date d'expiration du contrôle techique</Label>
                                <InputOTP
                                    {...editableState === true ? { disabled: false } : { disabled: true }}
                                    value={vehicleData.safetyInspectionDate}
                                    onChange={(newValue) => setVehicleData(vehicleData => ({ ...vehicleData, ["safetyInspectionDate"]: newValue }))}
                                    name="safetyInspectionDate"
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
                                <Label htmlFor="fuel">Carburant </Label>
                                {
                                    (vehicleData.fuel) !== undefined || (isEdit !== "true" && isEdit !== "false") ? // TO RENDER ONLY WHEN GOT DATA
                                        <Select
                                            {...editableState === true ? { disabled: false } : { disabled: true }}
                                            required
                                            defaultValue={vehicleData.fuel}
                                            onValueChange={(fuelvalue) => setVehicleData({ ...vehicleData, ["fuel"]: fuelvalue })}>

                                            <SelectTrigger >
                                                <SelectValue placeholder={vehicleData.fuel} />
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
                                <Label htmlFor="licencePlate">Plaque d'immatriculation</Label>
                                <Input
                                    {...editableState === true ? { disabled: false } : { disabled: true }}
                                    name="licencePlate"
                                    value={vehicleData.licencePlate}
                                    onChange={onChange}
                                    type="text" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="colour">Couleur</Label>
                                <Input
                                    {...editableState === true ? { disabled: false } : { disabled: true }}
                                    name="colour"
                                    value={vehicleData.colour}
                                    onChange={onChange}
                                    type="text" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="PTAC">PTAC (Poids Total Autorisé en Charge, en kg)</Label>
                                <Input
                                    {...editableState === true ? { disabled: false } : { disabled: true }}
                                    name="PTAC"
                                    value={vehicleData.PTAC}
                                    onChange={onChange}
                                    type="number" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="tyre">Modèle de pneus</Label>
                                <Input
                                    {...editableState === true ? { disabled: false } : { disabled: true }}
                                    name="tyre"
                                    value={vehicleData.tyre}
                                    onChange={onChange}
                                    type="text" />
                            </div>

                            <div className="grid gap-2 lg:col-span-2">
                                <Label htmlFor="details">Note</Label>
                                <Textarea
                                    {...editableState === true ? { disabled: false } : { disabled: true }}
                                    className="h-20"
                                    name="details"
                                    value={vehicleData.note}
                                    onChange={onChange}
                                    placeholder="Bla bla bla débrancher la batterie, bla bla bla capricieux au démarrage, bla bla bla ..." />
                            </div>

                        </div>
                    </div>


                    <div className={`flex mt-10 ${editableState === true ? "" : "hidden"}`} >

                        {(id === null || isNaN(parseInt(id))) ?
                            <>
                                <Button type="submit" className="flex flex-col w-2/3 items-center gap-1 text-center"> Ajouter </Button>
                                <Button variant="destructive" onClick={() => commonDetails.CancelLink()} className="flex flex-col ml-5 py-4 items-center text-center w-1/3 "> Annuler </Button>
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
                        onClick={() => setEditableState(true)} variant="secondary" className="flex flex-col w-1/2 items-center gap-1 text-center"> Modifier </Button>
                    <Button type="button" onClick={() => commonDetails.BackLink()} className="flex flex-col ml-5 py-4 items-center text-center w-1/2 "> Retour </Button>
                </div>


                <div className="flex mt-5">
                    {commonDetails.ChangeSubmitState(submitState, id)}
                </div>

            </div >


        </>
    )
}