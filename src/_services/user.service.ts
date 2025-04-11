import Axios from "@/_services/caller.service"

const getAll = () => {
    return Axios.get("/users")
}

const getOne = (uid: any) => {
    return Axios.get("/users/" + uid)
}

// GET ACTIVE USERS DETAILS
/* const getActive = () => {
    return Axios.get("/users/active")
} */
const getActiveCount = () => { // OLD : GET USER COUNT
    return Axios.get("/users/active/count")
}

// GET TRASH USERS DETAILS
const getTrashOne = () => {
    return Axios.get("/users/trash")
}
const getTrashCount = () => {
    return Axios.get("/users/trash/count")
}

// TRASH ACTIONS
const trashOne = (uid: any) => {
    return Axios.delete("/users/trash/" + uid)
}

const untrashOne = (uid: any) => {
    return Axios.post("/users/untrash/" + uid)
}

const addOne = (uData: any) => {
    return Axios.put("/users", uData)
}

const editOne = (uid: any, uData: any) => {
    return Axios.patch("/users/" + uid, uData)
}

/*

const trashUser = (uid: any) => {
    //
}

const deletuser = (uid: any) => {
    //
}
*/

export const userService = {
    getAll,
    getOne,
    //getActive,
    getActiveCount,
    getTrashOne,
    getTrashCount,

    trashOne,
    untrashOne,

    addOne,
    editOne
}