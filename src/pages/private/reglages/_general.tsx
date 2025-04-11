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

import { useEffect, useState, useRef } from "react"
import { userService } from "@/_services/user.service"
import { accountService } from "@/_services/account.service"

export default function General() {

    /***************** VARIABLES *****************/
    const flag = useRef(false)
    const [submitState, setSubmitState] = useState("")
    const [userData, setUserData] = useState({
        email: "",
        name: "",
        familyName: "",
        phoneNumber: "",

        city: "",
        cityCode: "",
        country: "",
        address: "",
    })

    /***************** SET DATA INSIDE INPUT *****************/
    // Get user on display
    useEffect(() => {
        if (flag.current === false) {
            userService.getOne(accountService.getTokenInfo().id)
                .then(res => {
                    (document.getElementById("mainForm") as HTMLFormElement).reset()
                    Object.keys(res.data.data).forEach(function (key) {
                        (res.data.data[key] === null || res.data.data[key] === undefined) ?
                            setUserData(userData => ({ ...userData, [key]: "" })) :
                            setUserData(userData => ({ ...userData, [key]: res.data.data[key] }))
                    })
                })
                .catch(e => console.log(e))
        }

        return () => { flag.current = true }
    }, [])

    /***************** SET CREDENTIALS INSIDE INPUTS *****************/
    const onChange = (e: any) => {

        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        })

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
                        <CircleCheck className="mr-2 h-4 w-4" /> Profil modifié avec succès
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
                <CardTitle>Information personnelles</CardTitle>
                <CardDescription>
                    informations utilisées pour vous identifier et vous joindre
                </CardDescription>
            </CardHeader>
            <form id="mainForm" onSubmit={onSubmit}>
                <CardContent>

                    <div className="flex flex-1 gap-x-10 flex-col gap-4 grid grid-cols-1 lg:grid-cols-2">

                        <div className="grid gap-2">
                            <Label htmlFor="familyName">Nom</Label>
                            <Input disabled
                                name="familyName"
                                value={userData.familyName}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="name">Prénom</Label>
                            <Input disabled
                                name="name"
                                value={userData.name}
                            />
                        </div>


                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                name="email"
                                value={userData.email}
                                onChange={onChange}
                                type="email"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phoneNumber">Numéro de télephone</Label>
                            <Input
                                name="phoneNumber"
                                value={userData.phoneNumber}
                                onChange={onChange}
                                type="tel"
                            />
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
                                name="address"
                                value={userData.address}
                                onChange={onChange}
                                type="text"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="cityCode">Code postal</Label>
                            <Input
                                name="cityCode"
                                value={userData.cityCode}
                                onChange={onChange}
                                type="text"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="city">Ville</Label>
                            <Input
                                name="city"
                                value={userData.city}
                                onChange={onChange}
                                type="text"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="country">Pays</Label>
                            <Input
                                name="country"
                                value={userData.country}
                                onChange={onChange}
                                type="text"
                                required
                            />
                        </div>

                    </div>

                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button type="submit" className="flex flex-col w-1/2 items-center gap-1 text-center">Enregistrer les changements</Button>
                    <div className="flex flex-col ml-5 items-center text-center w-1/2 ">
                        {changeState(submitState)}
                    </div>
                </CardFooter>
            </form>
        </Card>
        </>
    )
}