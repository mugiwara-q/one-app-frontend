import { Outlet } from 'react-router-dom';

import Footer from  "@layout/Footer"

const AuthLayout = () => {
    return (
        <div>
            <Outlet/>
            <Footer/>
        </div>
    )
}
export default AuthLayout