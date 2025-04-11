import { accountService } from "@/_services/account.service"
import Error from "@utils/error"

export default function RoleGuard ({ children, page }: any) {

    // check if token allows it
    let access = accountService.checkRole(page, ["w", "r", "rw"]) // each page asks for any of r w rw
    return access ? children : <Error />
}
