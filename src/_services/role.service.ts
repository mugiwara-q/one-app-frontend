import Axios from "@/_services/caller.service"

const getAllRoles = () => {
    return Axios.get("/roles")
}

const getUserRoles = (uid: any) => {
    return Axios.get("/roles/" + uid)
}

// GET ACTIVE USERS DETAILS
const editUserRoles = (user: any) => {
    return Axios.patch("/roles/" + user.id, user)
}

export const roleService = {
    getAllRoles,
    getUserRoles,
    editUserRoles
}