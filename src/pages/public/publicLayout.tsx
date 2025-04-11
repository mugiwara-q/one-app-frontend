import { Outlet } from 'react-router-dom';
import Footer from "@layout/Footer"

const PublicLayout = () => {
    return (
        <div>
            <Outlet />
            <Footer />
        </div>
    )
}
export default PublicLayout