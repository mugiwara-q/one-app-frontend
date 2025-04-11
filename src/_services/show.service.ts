import Axios from "@/_services/caller.service"

const getAll = () => {
    return Axios.get("/shows")
}

const getActiveCount = () => {
    return Axios.get("/shows/activeCount")
}

/* ############################################################# */

const getOne = (sid: any) => {
    return Axios.get("/shows/" + sid)
}

const addOne = (sData: any) => {
    return Axios.put("/shows/", sData)
}

const editOne = (sid: any, sData: any) => {
    return Axios.patch("/shows/" + sid, sData)
}

/* ############################################################# */

const getTrashCount = () => {
    return Axios.get("/shows/trashCount")
}

const untrashOne = (sid: any) => {
    return Axios.delete("/shows/untrash/" + sid)
}

const trashOne = (sid: any) => {
    return Axios.delete("/shows/trash/" + sid)
}

export const showService = {
    getAll,
    getActiveCount,
    getOne,
    addOne,
    editOne,
    getTrashCount,
    untrashOne,
    trashOne
}