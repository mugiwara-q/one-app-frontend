
import Toolbox from "./toolbox"
import Alert from "./alert"

export default function Dashboard() {

    return (
        <>

            <div className="flex items-center pb-1 border-b">
                <h1 className="font-semibold text-2xl">DASHBOARD</h1>
            </div>

            <div>
                <Alert />
            </div>

            <div>
                <Toolbox />
            </div>

        </>

    )
}
