import Axios from "@/_services/caller.service"

const getAll = () => {
    return Axios.get("/inventory/buffer/")
}

const getActiveCount = () => {
    return Axios.get("/inventory/buffer/activeCount")
}

/* ############################################################# */

const getOne = (iid: any) => {
    return Axios.get("/inventory/buffer/" + iid)
}
const addOne = (sData: any) => {
    return Axios.put("/inventory/buffer/", sData)
}
const editOne = (iid: any, sData: any) => {
    return Axios.patch("/inventory/buffer/" + iid, sData)
}

const moveToInventory = (iid: any, sData: any) => {
    return Axios.patch("/inventory/moveToInventory/" + iid, sData)
}

/* ############################################################# */

const deleteOne = (iid: any) => {
    return Axios.delete("/inventory/buffer/delete/" + iid)
}

export const inventoryBufferService = {
    getAll,
    getActiveCount,
    getOne,
    addOne,
    moveToInventory,
    editOne,
    deleteOne
}