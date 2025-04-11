// ui imports
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from "@ui/card"
import { Label } from "@ui/label"
import { Input } from "@ui/input"
import { Button } from "@ui/button"
import { RotateCw, CircleX, CircleCheck } from "lucide-react"

import { useState } from "react"
import { userService } from "@/_services/user.service"
import { accountService } from "@/_services/account.service"

export default function Securite() {

    /***************** VARIABLES *****************/
    const [submitState, setSubmitState] = useState("")
    const [mayEditPassword, setMayEditPassword] = useState<boolean>(false)
    const [userData, setUserData] = useState({
        password: "",
        passwordBis: "",
    })
    const [passwordContains, setpasswordContains] = useState({
        caractersCount: false,
        upperCase: false,
        numeric: false,
        specialCaracter: false
    })
    const specialChars = /[!@#$%^&',?:;=]/

    /***************** SET CREDENTIALS INSIDE INPUTS *****************/
    const onChange = (e: any) => {

        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        })

        
        /***************** CHECK PASSWORD COHERENCE *****************/
        if (e.target.name === "password") {
            // length
            e.target.value.length >= 10 ? setpasswordContains(passwordContains => ({ ...passwordContains, caractersCount: true }))
            : setpasswordContains(passwordContains => ({ ...passwordContains, caractersCount: false }))
            //uppercase
            e.target.value.match(/[A-Z]/) ? setpasswordContains(passwordContains => ({ ...passwordContains, upperCase: true }))
            : setpasswordContains(passwordContains => ({ ...passwordContains, upperCase: false }))
            //numeric
            e.target.value.match(/[0-9]/) ? setpasswordContains(passwordContains => ({ ...passwordContains, numeric: true }))
            : setpasswordContains(passwordContains => ({ ...passwordContains, numeric: false }))
            //specialCaracter
            specialChars.test(e.target.value) ? setpasswordContains(passwordContains => ({ ...passwordContains, specialCaracter: true }))
            : setpasswordContains(passwordContains => ({ ...passwordContains, specialCaracter: false }))
        }
        console.log("#")
        console.log(e.target.value)
        console.log(userData.password)
        console.log(userData.passwordBis)

        if (e.target.name === "password") {
            (passwordContains.caractersCount && passwordContains.upperCase && passwordContains.numeric && passwordContains.specialCaracter && e.target.value === userData.passwordBis) ?
            setMayEditPassword(true) : setMayEditPassword(false)
        }
        else if (e.target.name === "passwordBis") {
            (passwordContains.caractersCount && passwordContains.upperCase && passwordContains.numeric && passwordContains.specialCaracter && e.target.value === userData.password) ?
            setMayEditPassword(true) : setMayEditPassword(false)
        }
        
    }

    /***************** SUBMIT CREDENTIALS TO API *****************/
    const onSubmit = (e: any) => {
        e.preventDefault()
        //delete userData.userData
        setSubmitState("loading")

        userService.editOne(accountService.getTokenInfo().id, userData)
            .then(() => {
                setSubmitState("done")
            })
            .catch(() => {
                setSubmitState("error")
            })
    }

    /***************** STATE SUBMIT INFORMATION *****************/
    const changeState = (state: string) => {
        switch (state) {
            case "loading":
                return (<>
                    <Button disabled className="flex items-center text-center w-full">
                        <RotateCw className="mr-2 h-4 w-4 animate-spin" /> Modification en cours
                    </Button>
                </>)

            case "done":
                return (<>
                    <Button className="flex items-center text-center w-full bg-lime-900 text-white ">
                        <CircleCheck className="mr-2 h-4 w-4" /> Mot de passe modifié avec succès
                    </Button>
                </>)

            case "error":
                return (<>
                    <Button variant="destructive" className="flex items-center text-center w-full">
                        <CircleX className="mr-2 h-4 w-4" />Erreur lors de la modification
                    </Button>
                </>)

            default:
                return (<></>)
        }
    }



    return (
        <> <Card x-chunk="dashboard-04-chunk-1">
            <CardHeader>
                <CardTitle>Modifier le mot de passe</CardTitle>
                <CardDescription>
                    modification du mot de passe
                </CardDescription>
            </CardHeader>
            <form id="mainForm" onSubmit={onSubmit}>
                <CardContent>

                    <div className="flex flex-1 gap-x-10 flex-col gap-4 grid grid-cols-1">

                        <div className="grid gap-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                                name="password"
                                value={userData.password}
                                onChange={onChange}
                                type="text"
                                required />

                            <div className="flex grid grid-cols-2">
                                <div className={`flex items-center text-center w-full ${passwordContains.caractersCount ? "text-lime-600" : "text-red-600"}`}>
                                    {passwordContains.caractersCount ? <CircleCheck className="mr-2 h-4 w-4" /> : <CircleX className="mr-2 h-4 w-4" />} 10 caractères
                                </div>
                                <div className={`flex items-center text-center w-full ${passwordContains.numeric ? "text-lime-600" : "text-red-600"}`}>
                                    {passwordContains.numeric ? <CircleCheck className="mr-2 h-4 w-4" /> : <CircleX className="mr-2 h-4 w-4" />} 1 chiffre
                                </div>

                                <div className={`flex items-center text-center w-full ${passwordContains.upperCase ? "text-lime-600" : "text-red-600"}`}>
                                    {passwordContains.upperCase ? <CircleCheck className="mr-2 h-4 w-4" /> : <CircleX className="mr-2 h-4 w-4" />}  1 majuscule
                                </div>

                                <div className={`flex items-center text-center w-full ${passwordContains.specialCaracter ? "text-lime-600" : "text-red-600"}`}>
                                    {passwordContains.specialCaracter ? <CircleCheck className="mr-2 h-4 w-4" /> : <CircleX className="mr-2 h-4 w-4" />} 1 caractère spécial !@#$%^&',?:;=
                                </div>
                            </div>
                        </div>


                        <div className="grid gap-2">
                            <Label htmlFor="passwordBis">Réecrivez le mot de passe</Label>
                            <Input
                                name="passwordBis"
                                value={userData.passwordBis}
                                onChange={onChange}
                                type="password"
                                required />
                        </div>

                        <div className={`flex items-center text-center w-full ${userData.password === userData.passwordBis ? "text-lime-600" : "text-red-600"}`}>
                            {userData.password === userData.passwordBis ? <CircleCheck className="mr-2 h-4 w-4" /> : <CircleX className="mr-2 h-4 w-4" />} Mots de passes {userData.password === userData.passwordBis ? "" : "non"} identiques
                        </div>

                    </div>

                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button disabled={!mayEditPassword} type="submit" className="flex flex-col w-1/2 items-center gap-1 text-center">Enregistrer les changements</Button>
                    <div className="flex flex-col ml-5 items-center text-center w-1/2 ">
                        {changeState(submitState)}
                    </div>
                </CardFooter>
            </form>
        </Card>
        </>
    )
}