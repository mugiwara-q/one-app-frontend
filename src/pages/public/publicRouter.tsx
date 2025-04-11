import { Routes, Route } from "react-router-dom";

import PublicLayout from "@/pages/public/publicLayout"
import Error from "@utils/error"
import Home from "@/pages/public/home"

const PublicRouter = () => {
    return (
        <Routes>
            <Route element={<PublicLayout />}>
                <Route index element={<Home />} />

                <Route path="home" element={<Home />} />
                <Route path="error" element={<Error />} />

                <Route path="*" element={<Error />} />
            </Route>        
        </Routes>
    );
};

export default PublicRouter
