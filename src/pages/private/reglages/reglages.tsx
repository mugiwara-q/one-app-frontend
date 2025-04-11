import General from "./_general"
import Securite from "./_securite"
import Support from "./_support"

import { SeeMore, SeeTrigger, SeeList, SeeComponent } from '@layout/SeeMore'

import { useState } from "react"

export default function Reglages() {

    const [isActive, setIsActive] = useState("a")

    return (
        <>
            <div className="flex items-center pb-1 border-b">
                <h1 className="text-lg font-semibold md:text-2xl">REGLAGES</h1>
            </div>

            <SeeMore defaultValue="a" className="md:flex pb-1">

                <SeeList className="flex md:flex-col md:w-1/5 md:mt-10 mb-4 ml-10 gap-4 text-sm text-muted-foreground">
                    <SeeTrigger value="a"><p className={isActive === "a" ? "font-semibold text-primary" : " "} onClick={() => { setIsActive("a") }}> Général </p> </SeeTrigger>
                    <SeeTrigger value="b" ><p className={isActive === "b" ? "font-semibold text-primary" : " "} onClick={() => { setIsActive("b") }}> Sécurité</p></SeeTrigger>
                    <SeeTrigger value="c" ><p className={isActive === "c" ? "font-semibold text-primary" : " "} onClick={() => { setIsActive("c") }}> Support</p></SeeTrigger>
                </SeeList>

                <SeeComponent value="a" className="flex flex-col md:w-4/5 gap-6">
                    <General />
                </SeeComponent>

                <SeeComponent value="b" className="flex flex-col md:w-4/5 gap-6">
                    <Securite />
                </SeeComponent>

                <SeeComponent value="c" className="flex flex-col md:w-4/5 gap-6">
                    <Support />
                </SeeComponent>

            </SeeMore >
        </>
    )
}