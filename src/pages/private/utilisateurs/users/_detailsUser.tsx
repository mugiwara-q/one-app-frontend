import { Button } from "@ui/button"
import { Input } from "@ui/input"
import { Label } from "@ui/label"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@ui/breadcrumb"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@ui/input-otp"

import { RotateCw, CircleX, CircleCheck } from "lucide-react"

import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from "react"

import { ParseNumberToIsoDate, ParseIsoDateToNumber } from "@/_utils/helpers"
import Error from "@utils/error"
import { userService } from "@/_services/user.service"
import { accountService } from "@/_services/account.service"

export default function DetailsUser() {

    /***************** VARIABLES *****************/

    const queryParameters = new URLSearchParams(window.location.search)
    const isEdit = queryParameters.get("isEdit")
    const id = queryParameters.get("id")
    const flag = useRef(false)
    const [displayError, setDisplayError] = useState(false)
    const [submitState, setSubmitState] = useState("")
    const [userData, setUserData] = useState({
        email: "",
        name: "",
        familyName: "",
        phoneNumber: "",
        birthDate: "",
        birthCity: "",

        city: "",
        cityCode: "",
        country: "",
        address: "",

        passportExpirationDate: "",
        passportNumber: "",
        securiteSocialeNumber: "",
        addedById: ""
    })

    const [editableState, setEditableState] = useState(false)

    /***************** SET DATA INSIDE INPUT *****************/
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

            if ((isEdit === "true" || isEdit === "false") && id !== null && !isNaN(parseInt(id))) {
                userService.getOne(id)
                    .then(res => {
                        (document.getElementById("mainForm") as HTMLFormElement).reset()
                        Object.keys(res.data.data).forEach(function (key) {
                            (res.data.data[key] === null || res.data.data[key] === undefined) ?
                                setUserData(userData => ({ ...userData, [key]: "" })) :
                                (key === "birthDate" || key === "passportExpirationDate") ?
                                    setUserData(userData => ({ ...userData, [key]: ParseIsoDateToNumber(res.data.data[key]) }))
                                    :
                                    setUserData(userData => ({ ...userData, [key]: res.data.data[key] }))
                        })
                    })
                    .catch(() => setDisplayError(true))
            }
        }

        return () => { flag.current = true }
    }, [])


    /***************** SET DATA INSIDE INPUTS *****************/
    const onChange = (e: any) => {
        setUserData({ ...userData, [e.target.name]: e.target.value })
    }
    /***************** SUBMIT CREDENTIALS TO API *****************/
    const onSubmit = (e: any) => {
        e.preventDefault()
        setSubmitState("loading")

        if ((userData.birthDate.length === 8 || userData.birthDate.length === 0) &&
            (userData.passportExpirationDate.length === 8 || userData.passportExpirationDate.length === 0)) { // empty or filled

            let submitedData = { ...userData } // to clone without affecting display
            if (userData.birthDate.length === 8) { // if date not empty => format date
                submitedData.birthDate = ParseNumberToIsoDate(submitedData.birthDate) // ISO DATE FORMAT
            }

            if (userData.passportExpirationDate.length === 8) { // if date not empty => format date
                submitedData.passportExpirationDate = ParseNumberToIsoDate(submitedData.passportExpirationDate) // ISO DATE FORMAT
            }

            if (id === null || isNaN(parseInt(id))) { // add
                submitedData.addedById = accountService.getTokenInfo().id

                userService.addOne(submitedData)
                    .then(() => {
                        setSubmitState("done")
                    })
                    .catch(() => {
                        setSubmitState("error")
                    })
            }
            else { // edit
                userService.editOne(id, submitedData)
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
    // get details
    let navigate = useNavigate()
    const cancelLink = () => {
        navigate("../utilisateurs")
    }

    /***************** STATE SUBMIT INFORMATION *****************/
    const changeState = (state: string) => {
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
                            "Utilisateur ajouté avec succès !" :
                            "Utilisateur modifié avec succès !"}
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

    return (
        <>
            <div className="flex items-center pb-1 border-b">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link className="font-semibold text-2xl" to="../utilisateurs">UTILISATEURS</Link >
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />

                        <BreadcrumbItem>
                            {((isEdit === "true" || isEdit === "false") && id !== null && !isNaN(parseInt(id))) ?
                                <Link to="" className="font-semibold text-2xl text-white">{editableState === true ? "Modifier un utilisateur" : "Consulter un utilisateur"} </Link> :
                                <Link to="" className="font-semibold text-2xl text-white">Ajouter un utilisateur </Link>
                            }
                        </BreadcrumbItem>

                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="border p-10 border-solid rounded-lg shadow-sm">

                {(id === null || isNaN(parseInt(id))) ?
                    <>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Nouvel utilisateur :
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Ajouter un utilisateur
                        </p>
                    </>
                    :
                    <>
                        <h2 className="text-2xl font-bold tracking-tight">
                            {userData.familyName.toUpperCase() + " " + userData.name.charAt(0).toUpperCase() + userData.name.slice(1) + ":"}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Consulter les détails de l'utilisateur

                        </p>
                    </>
                }

                <br />

                <form id="mainForm" onSubmit={onSubmit}>

                    <div className="flex flex-1 justify-center">

                        <div className="flex flex-1 gap-x-10 flex-col gap-4 grid grid-cols-1 lg:grid-cols-2">

                            <div className="grid gap-2">
                                <Label htmlFor="familyName">Nom</Label>
                                <Input
                                    {...editableState ? { disabled: false } : { disabled: true }}
                                    name="familyName"
                                    value={userData.familyName}
                                    onChange={onChange}
                                    type="text"
                                    required />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Prénom</Label>
                                <Input
                                    {...editableState ? { disabled: false } : { disabled: true }}
                                    name="name"
                                    value={userData.name}
                                    onChange={onChange}
                                    type="text"
                                    required />
                            </div>


                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    {...editableState ? { disabled: false } : { disabled: true }}
                                    name="email"
                                    value={userData.email}
                                    onChange={onChange}
                                    type="email"
                                    placeholder="exemple@concept-evenementiel.com"
                                    required />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phoneNumber">Numéro de télephone</Label>
                                <Input
                                    {...editableState ? { disabled: false } : { disabled: true }}
                                    name="phoneNumber"
                                    value={userData.phoneNumber}
                                    onChange={onChange}
                                    type="tel"
                                    required />
                            </div>


                            <div className="grid gap-2">
                                <br />
                            </div>
                            <div className="grid gap-2">
                                <br />
                            </div>


                            <div className="grid gap-2">
                                <Label htmlFor="birthDate">Date de naissance</Label>

                                <InputOTP
                                    {...editableState ? { disabled: false } : { disabled: true }}
                                    value={userData.birthDate}
                                    onChange={(newValue) => setUserData(userData => ({ ...userData, ["birthDate"]: newValue }))}
                                    name="birthDate"
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
                                <Label htmlFor="birthCity">Ville de naissance</Label>
                                <Input
                                    {...editableState ? { disabled: false } : { disabled: true }}
                                    name="birthCity"
                                    value={userData.birthCity}
                                    onChange={onChange}
                                    type="text"
                                    required />
                            </div>


                            <div className="grid gap-2">
                                <br />
                            </div>
                            <div className="grid gap-2">
                                <br />
                            </div>


                            <div className="grid gap-2">
                                <Label htmlFor="address">Adresse</Label>
                                <Input
                                    {...editableState ? { disabled: false } : { disabled: true }}
                                    name="address"
                                    value={userData.address}
                                    onChange={onChange}
                                    type="text"
                                    required />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="cityCode">Code postal</Label>
                                <Input
                                    {...editableState ? { disabled: false } : { disabled: true }}
                                    name="cityCode"
                                    value={userData.cityCode}
                                    onChange={onChange}
                                    type="number"
                                    required />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="city">Ville</Label>
                                <Input
                                    {...editableState ? { disabled: false } : { disabled: true }}
                                    name="city"
                                    value={userData.city}
                                    onChange={onChange}
                                    type="text"
                                    required />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="country">Pays</Label>
                                <Input
                                    {...editableState ? { disabled: false } : { disabled: true }}
                                    name="country"
                                    value={userData.country}
                                    onChange={onChange}
                                    type="text"
                                    required />
                            </div>



                            <div className="grid gap-2">
                                <br />
                            </div>
                            <div className="grid gap-2">
                                <br />
                            </div>



                            <div className="grid gap-2">
                                <Label htmlFor="securiteSocialeNumber">Numéro de sécurité sociale</Label>
                                <Input
                                    {...editableState ? { disabled: false } : { disabled: true }}
                                    name="securiteSocialeNumber"
                                    value={userData.securiteSocialeNumber}
                                    onChange={onChange}
                                    type="text"
                                    required />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="passportNumber">Numéro de passport</Label>
                                <Input
                                    {...editableState ? { disabled: false } : { disabled: true }}
                                    name="passportNumber"
                                    value={userData.passportNumber}
                                    onChange={onChange}
                                    type="text" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="passportExpirationDate">Date d'expiration du passeport</Label>

                                <InputOTP
                                    {...editableState ? { disabled: false } : { disabled: true }}
                                    value={userData.passportExpirationDate}
                                    onChange={(newValue) => setUserData(userData => ({ ...userData, ["passportExpirationDate"]: newValue }))}
                                    name="passportExpirationDate"
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


                        </div>
                    </div>

                    <div className={`flex mt-10 ${editableState === true ? "" : "hidden"}`} >

                        {(id === null || isNaN(parseInt(id))) ?
                            <>
                                <Button type="submit" className="flex flex-col w-2/3 items-center gap-1 text-center">Ajouter l'utilisateur</Button>
                                <Button variant="destructive" onClick={() => cancelLink()} className="flex flex-col ml-5 py-4 items-center text-center w-1/3 "> {submitState == "done" ? "Retour" : "Annuler"} </Button>
                            </> :
                            <>
                                <Button type="submit" className="flex flex-col w-2/3 items-center gap-1 text-center">Enregistrer les modifications</Button>
                                <Button type="button" variant="destructive"
                                    onClick={() => {
                                        setEditableState(false)
                                        setSubmitState("")
                                    }}
                                    className="flex flex-col ml-5 py-4 items-center text-center w-1/3 "> Annuler les modifications</Button>
                            </>}
                    </div>

                </form>

                <div className={`flex mt-10 ${editableState === true ? "hidden" : ""}`} >
                    <Button {...accountService.checkRole("utilisateurs", ["w"]) ? { disabled: false } : { disabled: true }} onClick={() => setEditableState(true)} variant="secondary" className="flex flex-col w-1/2 items-center gap-1 text-center">Modifier l'utilisateur</Button>
                    <Button type="button" onClick={() => cancelLink()} className="flex flex-col ml-5 py-4 items-center text-center w-1/2 "> Retour </Button>
                </div>


                <div className="flex mt-5">
                    {changeState(submitState)}
                </div>

            </div >


        </>
    )
}
