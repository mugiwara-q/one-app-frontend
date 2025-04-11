import { Routes, Route } from "react-router-dom";

import Error from "@utils/error"
import AuthLayout from "@pages/auth/authLayout"
import Login from "@pages/auth/login"

const AuthRouter = () => {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route index element={<Login />} />

                <Route path="login" element={<Login />} />
                <Route path="error" element={<Error />} />

                <Route path="*" element={<Error />} />
            </Route>        
        </Routes>
    );
};

export default AuthRouter