import { Outlet } from 'react-router-dom';

// import components
import Header from "@layout/Header"
import Footer from "@layout/Footer"
import NavMenu from "@layout/Navmenu"


const PrivateLayout = () => {
    return (
        <div className="privateLayout overflow-hidden">
            <Header />
            <div className="relative grid w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">

                <div className="absolute top-0 right-1 p-2">
                    <NavMenu isMobile={true} />
                </div>

                <div className="hidden min-h-screen border-r bg-muted/40 md:block flex flex-col gap-2">
                    <NavMenu isMobile={false} />
                </div>

                <div className="flex flex-1 flex-col gap-4 p-3 lg:gap-6 lg:p-6 overflow-hidden">
                    <Outlet />
                </div>

            </div>
            <Footer />
        </div>
    )
}
export default PrivateLayout

