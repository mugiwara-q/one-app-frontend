import Axios from "@/_services/caller.service"

const getAll = () => {
    return Axios.get("/vehicles")
}

const getAllFromCategory = (cat: string) => {
    return Axios.get("/vehicles/category/" + cat)
}

const getActiveCount = () => {
    return Axios.get("/vehicles/activeCount")
}

const getExpiredInspectionDateCount = () => {
    return Axios.get("/vehicles/expiredInspectionDate/count")
}

const getExpiredInspectionDate = () => {
    return Axios.get("/vehicles/expiredInspectionDate")
}

const getInspectionDateLimitMonths = () => {
    return Axios.get("/vehicles/expiredInspectionDate/limitInMonths")
}


/* ############################################################# */

const getOne = (vid: any) => {
    return Axios.get("/vehicles/" + vid)
}

const addOne = (svData: any) => {
    return Axios.put("/vehicles/", svData)
}

const editOne = (sid: any, sData: any) => {
    return Axios.patch("/vehicles/" + sid, sData)
}

/* ############################################################# */

const getTrashCount = () => {
    return Axios.get("/vehicles/trashCount")
}

const untrashOne = (sid: any) => {
    return Axios.delete("/vehicles/untrash/" + sid)
}

const trashOne = (sid: any) => {
    return Axios.delete("/vehicles/trash/" + sid)
}

export const vehicleService = {
    getAll,
    getAllFromCategory,
    getActiveCount,
    getExpiredInspectionDateCount,
    getExpiredInspectionDate,
    getInspectionDateLimitMonths,
    getOne,
    addOne,
    editOne,
    getTrashCount,
    untrashOne,
    trashOne
}