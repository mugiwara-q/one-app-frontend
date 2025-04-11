import { Navigate } from "react-router-dom";
import { accountService } from "@/_services/account.service"

export default function AuthGuard({ children }: any) {

    if (!accountService.isLogged()) {
        return <Navigate to="/auth/login" />
    }

    return children
}
