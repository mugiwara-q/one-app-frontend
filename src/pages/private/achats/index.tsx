// ui imports
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card"
import { SeeMore, SeeTrigger, SeeList, SeeComponent } from '@layout/SeeMore'

import {
    Database,
    ShoppingCart
} from "lucide-react"

import { useState, useEffect } from "react"

import { wishItemService } from "@/_services/wishItem.service"
import BuyList from "./buyList"
import Catalogue from "./catalogue/catalogue"

export default function Achats() {

    /***************** STATE VARIABLES *****************/
    const [cartWaitingCount, setCartWaitingCount] = useState(0)
    const [catalogueCount] = useState("?")
    
    const queryParameters = new URLSearchParams(window.location.search)

    const [activeSeeItem, setActiveSeeItem] = useState(queryParameters.get("see") || "a")

    /***************** SERVICE *****************/
    useEffect(() => {
        wishItemService.getWaitingCount()
            .then(res => {
                setCartWaitingCount(res.data.data)
            })
            .catch(e => console.log(e))

    }, [])

    /***************** SEE ITEM FROM SEELIST *****************/
    function updateSeeItem(see: string) {
        const queryParams = new URLSearchParams(window.location.search);
        queryParams.set("see", see);
        history.pushState(null, "", "?" + queryParams.toString())
    }

    return (
        <>

            <div className="flex items-center pb-1 border-b">
                <h1 className="font-semibold text-2xl">ACHATS</h1>
            </div >

            <SeeMore defaultValue={activeSeeItem}>

                <SeeList className="pb-5 gap-4 grid grid-cols-1 md:grid-cols-2 border-b border-dashed">
                    <SeeTrigger value="a" onClick={() => updateSeeItem("a")}>
                        <Card className={(activeSeeItem === "a" ? "bg-muted" : " ") + ""} onClick={() => { setActiveSeeItem("a") }}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-2xl font-bold">
                                    SERVICE ACHATS
                                </CardTitle>
                                <ShoppingCart />
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm font-medium">Liste des achats et état d'avancement</div>
                                <p className="text-xs text-muted-foreground">
                                    {cartWaitingCount} en attente
                                </p>
                            </CardContent>
                        </Card>
                    </SeeTrigger>

                    <SeeTrigger value="b" onClick={() => updateSeeItem("b")}>
                        <Card className={activeSeeItem === "b" ? "bg-muted" : " "} onClick={() => { setActiveSeeItem("b") }}>
                            <CardHeader className="flex flex-col flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-2xl font-bold">
                                    BASE DE DONNEES
                                </CardTitle>
                                <Database />
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm font-medium">Catalogue fournisseurs</div>
                                <p className="text-xs text-muted-foreground">
                                    {catalogueCount} references
                                </p>
                            </CardContent>
                        </Card>
                    </SeeTrigger>

                </SeeList>

                <SeeComponent value="a">
                    <BuyList />
                </SeeComponent>

                <SeeComponent value="b">
                    <Catalogue />
                </SeeComponent>

            </SeeMore >

        </>
    )
}
