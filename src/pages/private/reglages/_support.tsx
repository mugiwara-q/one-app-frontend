// ui imports
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from "@ui/card"

export default function Support() {



    return (
        <> <Card x-chunk="dashboard-04-chunk-1">
            <CardHeader>
                <CardTitle>Support</CardTitle>
                <CardDescription>
                    en cas de difficultés
                </CardDescription>
            </CardHeader>
            <CardContent>

                <div className="">

                    En cas de problème ou de bug, merci de contacter le service IT :)
                    <br></br>
                    <br></br>
                    contact@concept-evenementiel.com

                </div>

            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <div className="flex flex-col items-center text-center w-full ">
                    ® 2025 CONCEPT EVENEMENTIEL
                </div>
            </CardFooter>
        </Card>
        </>
    )
}