import Axios from "@/_services/caller.service"

const getAll = () => {
    return Axios.get("/wishItems/")
}

const getAllActiveFromMe = () => {
    return Axios.get("/wishItems/activeFromMe")
}

const getAllFromCreatorId = (cat: any) => {
    return Axios.get("/wishItems/creatorId/" + cat)
}

const getAllActive = () => {
    return Axios.get("/wishItems/active")
}

const getAllTrash = () => {
    return Axios.get("/wishItems/trash")
}

/* ############################################################# */

const getActiveCount = () => {
    return Axios.get("/wishItems/activeCount")
}

const getTrashCount = () => {
    return Axios.get("/wishItems/trashCount")
}

const getWaitingCount = () => {
    return Axios.get("/wishItems/waitingCount")
}

/* ############################################################# */

const getOne = (iid: any) => {
    return Axios.get("/wishItems/" + iid)
}
const addOne = (iData: any) => {
    return Axios.put("/wishItems/", iData)
}

const editOne = (sid: any, iData: any) => {
    return Axios.patch("/wishItems/" + sid, iData)
}

/* ############################################################# */

const trashOne = (iid: any) => {
    return Axios.delete("/wishItems/trash/" + iid)
}

const untrashOne = (iid: any) => {
    return Axios.delete("/wishItems/untrash/" + iid)
}

export const wishItemService = {
    getAll,
    getAllActiveFromMe,
    getAllFromCreatorId,
    getAllActive,
    getAllTrash,
    getTrashCount,
    getActiveCount,
    getWaitingCount,
    getOne,
    addOne,
    editOne,
    trashOne,
    untrashOne
}