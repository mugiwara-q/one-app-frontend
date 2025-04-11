import Axios from "@/_services/caller.service"

const getAll = () => {
    return Axios.get("/catalogueItems")
}

// GET ACTIVE DETAILS
const getActiveCount = () => {
    return Axios.get("/catalogueItems/activeCount")
}

/* ############################################################# */

const getOne = (iid: any) => {
    return Axios.get("/catalogueItems/" + iid)
}

const addOne = (iData: any) => {
    return Axios.put("/catalogueItems/", iData)
}

const editOne = (iid: any, iData: any) => {
    return Axios.patch("/catalogueItems/" + iid, iData)
}

/* ############################################################# */

const trashOne = (sid: any) => {
    return Axios.delete("/machines/trash/" + sid)
}

export const catalogueItemService = {
    getAll,
    getActiveCount,
    getOne,
    addOne,
    editOne,
    trashOne,
}