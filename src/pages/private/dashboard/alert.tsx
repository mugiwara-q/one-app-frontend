
export default function Alert() {

    return (
        <>

            {/*** BUFFER ***/}
            <div className="overflow-hidden bg-red-900 border p-8 border-solid rounded-lg shadow-sm">

                <div className="flex flex-col gap-1">
                    <h3 className="text-2xl font-bold tracking-tight">
                        Alertes et annonces :
                    </h3>
                    <p className="text-sm text-muted-foreground pb-2">
                        Annonces générales.
                    </p>

                    <p className="">
                        Rien à signaler.
                    </p>

                </div>
            </div >


        </>
    )
}
