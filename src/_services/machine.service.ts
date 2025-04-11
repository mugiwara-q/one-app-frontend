import Axios from "@/_services/caller.service"

const getAll = () => {
    return Axios.get("/machines")
}

const getAllUnactive = () => {
    return Axios.get("/machines/unactive")
}

const getAllFromShow = (sid: any) => {
    return Axios.get("/machines/show/" + sid)
}

const getActiveCount = () => {
    return Axios.get("/machines/activeCount")
}

/* ############################################################# */

const getOne = (vid: any) => {
    return Axios.get("/machines/" + vid)
}

const addOne = (svData: any) => {
    return Axios.put("/machines/", svData)
}

const editOne = (sid: any, sData: any) => {
    return Axios.patch("/machines/" + sid, sData)
}

/* ############################################################# */

const getTrashCount = () => {
    return Axios.get("/machines/trashCount")
}

const untrashOne = (sid: any) => {
    return Axios.delete("/machines/untrash/" + sid)
}

const trashOne = (sid: any) => {
    return Axios.delete("/machines/trash/" + sid)
}

export const machineService = {
    getAll,
    getAllUnactive,
    getAllFromShow,
    getActiveCount,
    getOne,
    addOne,
    editOne,
    getTrashCount,
    untrashOne,
    trashOne
}