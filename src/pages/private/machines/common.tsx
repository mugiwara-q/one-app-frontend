
import { SelectItem } from "@ui/select"
import { Button } from "@ui/button"
import { UpperFirstLetter } from "@utils/helpers"
import { useNavigate } from "react-router-dom"
import { RotateCw, CircleX, CircleCheck } from "lucide-react"

// set vehicle types items
function PopulateVehicleTypes(displayList: any, machineCategory: string, voidMessage: string): React.ReactElement[] {
    const element: React.ReactElement[] = []
    if (displayList.length > 0) {

        displayList.map((item: any) => {
            if (item.category === machineCategory) {
                element.push(<SelectItem value={item.id.toString()} key={item.id}>{UpperFirstLetter(item.type)}</SelectItem>)
            }
        })
    }
    else { element.push(<div>{voidMessage}</div>) }
    return element
}

/***************** STATE SUBMIT INFORMATION *****************/
function ChangeSubmitState(state: string, id: string | null): React.ReactElement {
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
                        "Ajouté avec succès !" :
                        "Modifié avec succès !"}
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

/***************** CANCEL LINK *****************/
function CancelLink() {
    let navigate = useNavigate()
    navigate("../machines")
}

function BackLink() {
    let navigate = useNavigate()
    navigate(-1)
}

export const commonDetails = {
    PopulateVehicleTypes,
    CancelLink,
    BackLink,
    ChangeSubmitState,
}
