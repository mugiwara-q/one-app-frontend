import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

import { Undo2, KeyRound, Home } from "lucide-react"
import { useNavigate } from "react-router-dom";

export default function Error404 () {
    let navigate = useNavigate();
    return (
        <div className="flex items-center justify-center h-screen flex-col">

            <div className="border border-dashed rounded-lg p-8 flex items-center">
                <h1 className="font-semibold text-2xl pb-4 border-y-2 p-4"> *Erreur 404 - Page introuvable !* </h1>
            </div>

            <div className="flex items-center justify-center flex-wrap place-items-center">
                <Button onClick={() => navigate(-1)} className="m-4"> <Undo2 className="mr-2" /> Retour à la page precedente </Button>
                <Link to="/auth/login"> <Button className="m-4"> <KeyRound className="mr-2" /> Retour à la page de connexion </Button></Link>
                <Link to="/home"> <Button className="m-4"> <Home className="mr-2" /> Retour à la page home </Button></Link>
            </div>
        </div>
    )
}