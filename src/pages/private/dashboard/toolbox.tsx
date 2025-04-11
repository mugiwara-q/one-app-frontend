import { inventoryItemService } from "@/_services/inventoryItem.service"
import { UpperFirstLetter } from "@/_utils/helpers"
import { CardTitle } from "@ui/card"

import {
    Drill,
} from "lucide-react"

import { useEffect, useState } from "react"

export default function Toolbox() {

    const [toolsList, setToolsList] = useState([]) // list of users

    useEffect(() => {

        inventoryItemService.getMyTools()
            .then(res => {
                setToolsList(res.data.data)
            })
            .catch(e => console.log(e))

    }, [])

    /***************** RENDER FUNCTIONS *****************/
    /* function renderToolobx(displayList: any): React.ReactElement[] {
        const element: React.ReactElement[] = []

        if (displayList.length > 0) {
            displayList.map((item: any) => {
                element.push(
                    <Button
                        onMouseDown={() => {
                            setItemData(itemData => ({ ...itemData, ["model"]: item.model })) // auto fill model
                            // auto fill reference
                            if (itemData.category === "quincaillerie" || itemData.category === "consommables") {
                                setItemData(itemData => ({ ...itemData, ["reference"]: item.reference })) // auto fill model
                            }
                        }}
                        key={item.id}
                        size="icon" variant="link" className="justify-between text-left w-full pl-5 mb-1"
                    >
                        {UpperFirstLetter(item.model)}
                    </Button>
                )
            })
        }
        else { element.push(<div key="0"></div >) }
        return element
    } */

    function renderToolbox(data: any): React.ReactElement[] {

        console.log(data)

        const element: React.ReactElement[] = []

        if (data.length > 0) {
            data.map((item: any) => {
                element.push(
                    <div key={item.id} className="flex gap-4">
                        <div className="border border-solid rounded-lg p-6 focus:bg-muted" >
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-2xl font-bold"> {UpperFirstLetter(item.model)} </CardTitle>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground"> {item.brand.toUpperCase() + " " + item.model} </p>
                                <p className="text-xs text-muted-foreground"> {"REF: #" + item.reference} </p>
                            </div>
                        </div>
                    </div>
                )
            })
        }

        else {
            element.push(
                <div key="0" className="border border-solid rounded-lg p-6 focus:bg-muted" >
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-2xl font-bold"> Vide </CardTitle>
                        <Drill />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground"> Aucun outil dans la toolbox</p>
                    </div>
                </div>)
        }
        return element
    }


    return (
        <>

            {/*** BUFFER ***/}
            <div className="overflow-hidden border p-8 border-solid rounded-lg shadow-sm">

                <div className="flex flex-col gap-1">
                    <h3 className="text-2xl font-bold tracking-tight">
                        Mes outils :
                    </h3>
                    <p className="text-sm text-muted-foreground pb-4">
                        Les outils dans ma toolbox.
                    </p>

                    <div className="flex flex-col gap-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                        {renderToolbox(toolsList)}
                    </div>
                </div>
            </div >


        </>
    )
}
