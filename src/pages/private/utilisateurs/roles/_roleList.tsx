import { useEffect, useState } from "react"
import { roleService } from "@/_services/role.service"

import { RolesDataTable } from "./dataTable"
import { ROLE_TABLE_TITLE } from "./columnsDisplay"
import { ROLE_TABLE_COLUMNS } from "./columnsDisplay"

export default function RoleList() {

    /***************** STATE VARIABLES *****************/
    const [usersRole, setUsersRole] = useState([])

    /***************** ROLES SERVICES *****************/
    useEffect(() => {
        roleService.getAllRoles()
            .then(res => {
                setUsersRole(res.data.data)
            })
            .catch(e => console.log(e))

    }, [])

    return (
        <div className="overflow-hidden bg-background shadow h-full flex-1 flex-col space-y-8 md:flex">
            <RolesDataTable data={usersRole} columns={ROLE_TABLE_COLUMNS} head={ROLE_TABLE_TITLE} />
        </div>
    )
}