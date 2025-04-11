// ui imports
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card"

import {
    StickyNote,
    ReceiptText,
    PartyPopper,
    ReceiptEuro
} from "lucide-react"

import { SeeMore, SeeTrigger, SeeList, SeeComponent } from '@layout/SeeMore'

import { useState, useEffect } from "react"

import ShowList from "./shows/_showList"
import { showService } from "@/_services/show.service"


export default function Administratif() {

    /***************** STATE VARIABLES *****************/
    const [showCount, setShowCount] = useState(0)
    const queryParameters = new URLSearchParams(window.location.search)
    const [activeSeeItem, setActiveSeeItem] = useState(queryParameters.get("see") || "c")

    /***************** SERVICES *****************/
    useEffect(() => {
        showService.getActiveCount()
            .then(res => {
                setShowCount(res.data.data)
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
                <h1 className="font-semibold text-2xl">ADMINISTRATIF / DEVIS</h1>
            </div >

            <SeeMore defaultValue={activeSeeItem}>

                <SeeList className="flex flex-col pb-5 grid-cols-1 lg:grid-cols-3 gap-4 grid border-b border-dashed">
                    <SeeTrigger value="a" onClick={() => updateSeeItem("a")}>
                        <Card className={activeSeeItem === "a" ? "bg-muted" : " "} onClick={() => { setActiveSeeItem("a") }}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-2xl font-bold">
                                    DEVIS
                                </CardTitle>
                                <StickyNote />
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm font-medium">Rédiger et consulter les devis</div>
                                <p className="text-xs text-muted-foreground">
                                    - references
                                </p>
                            </CardContent>
                        </Card>
                    </SeeTrigger>

                    <SeeTrigger value="b" onClick={() => updateSeeItem("b")}>
                        <Card className={activeSeeItem === "b" ? "bg-muted" : " "} onClick={() => { setActiveSeeItem("b") }}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-2xl font-bold">
                                    FACTURES
                                </CardTitle>
                                <ReceiptText />

                            </CardHeader>
                            <CardContent>
                                <div className="text-sm font-medium">Rédiger et consulter les factures</div>
                                <p className="text-xs text-muted-foreground">
                                    - en attente
                                </p>
                            </CardContent>
                        </Card>
                    </SeeTrigger>

                    <SeeTrigger value="c" onClick={() => updateSeeItem("c")}>
                        <Card className={activeSeeItem === "c" ? "bg-muted" : " "} onClick={() => { setActiveSeeItem("c") }}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-2xl font-bold">
                                    SPECTACLES
                                </CardTitle>
                                <PartyPopper />

                            </CardHeader>
                            <CardContent>
                                <div className="text-sm font-medium">Details des spectacles</div>
                                <p className="text-xs text-muted-foreground">
                                    {showCount} spectacles
                                </p>
                            </CardContent>
                        </Card>
                    </SeeTrigger>

                    <SeeTrigger value="d" onClick={() => updateSeeItem("d")}>
                        <Card className={activeSeeItem === "d" ? "bg-muted" : " "} onClick={() => { setActiveSeeItem("d") }}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-2xl font-bold">
                                    TICKETS
                                </CardTitle>
                                <ReceiptEuro />

                            </CardHeader>
                            <CardContent>
                                <div className="text-sm font-medium">Tickets de caisse</div>
                                <p className="text-xs text-muted-foreground">
                                    - non traités
                                </p>
                            </CardContent>
                        </Card>
                    </SeeTrigger>

                </SeeList>

                <div className="flex items-center pb-5">
                </div>

                <SeeComponent value="a">
                    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed">

                        <div className="flex flex-col items-center gap-1 text-center">
                            <h3 className="text-2xl font-bold tracking-tight">
                                DEVIS
                            </h3>
                        </div>

                        <div className="p-4 flex grid">
                            <div className="overflow-hidden bg-background shadow h-full flex-1 flex-col space-y-8 md:flex">
                                { /*<DataTable data={users} columns={COLUMNS} head={SHOP_TABLE_TITLE} />*/}
                            </div>
                        </div>

                    </div>
                </SeeComponent>

                <SeeComponent value="b">
                    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed">

                        <div className="flex flex-col items-center gap-1 text-center">
                            <h3 className="text-2xl font-bold tracking-tight">
                                Factures
                            </h3>
                        </div>

                        <div className="p-4 flex grid">
                            <div className="overflow-hidden bg-background shadow h-full flex-1 flex-col space-y-8 md:flex">
                                { /*<DataTable data={users} columns={COLUMNS} head={SHOP_TABLE_TITLE} />*/}
                            </div>
                        </div>

                    </div>
                </SeeComponent>

                <SeeComponent value="c">
                    <ShowList />
                </SeeComponent>

                <SeeComponent value="d">
                    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed">

                        <div className="flex flex-col items-center gap-1 text-center">
                            <h3 className="text-2xl font-bold tracking-tight">
                                Tickets
                            </h3>
                        </div>

                        <div className="p-4 flex grid">
                            <div className="overflow-hidden bg-background shadow h-full flex-1 flex-col space-y-8 md:flex">
                                { /*<DataTable data={users} columns={COLUMNS} head={SHOP_TABLE_TITLE} />*/}
                            </div>
                        </div>

                    </div>
                </SeeComponent>

            </SeeMore >

        </>
    )
}
