import Axios from "@/_services/caller.service"

const getAll = () => {
    return Axios.get("/inventory")
}

const getAllActiveFromCategory = (cat: any) => {
    return Axios.get("/inventory/category/active/" + cat)
}

const getAllTrashFromCategory = (cat: any) => {
    return Axios.get("/inventory/category/trash/" + cat)
}

const getAllActive = () => {
    return Axios.get("/inventory/active")
}

const getAllTrash = () => {
    return Axios.get("/inventory/trash")
}

const getAllModelsFromCategory = (cat: any) => {
    return Axios.get("/inventory/filtered/modelsFromCategory/" + cat)
}

const getMyTools = () => {
    return Axios.get("/inventory/getMyTools/")
}

/* const getUserTools = (uid: any) => {
    return Axios.get("/inventory/getUserTools/" + uid)
} */

/* ############################################################# */

// const getAllBuffer= () => {]}
// const getOne = () => {]}


/* ############################################################# */

const getActiveCount = () => {
    return Axios.get("/inventory/activeCount")
}

const getTrashCount = () => {
    return Axios.get("/inventory/trashCount")
}

const getActiveCountFromCategory = (cat: any) => {
    return Axios.get("/inventory/category/activeCount/" + cat)
}

const getTrashCountFromCategory = (cat: any) => {
    return Axios.get("/inventory/category/trashCount/" + cat)
}

/* ############################################################# */

const getOne = (iid: any) => {
    return Axios.get("/inventory/" + iid)
}
const addOne = (sData: any) => {
    return Axios.put("/inventory/", sData)
}
const editOne = (sid: any, sData: any) => {
    return Axios.patch("/inventory/" + sid, sData)
}

/* ############################################################# */

const trashOne = (iid: any) => {
    return Axios.delete("/inventory/trash/" + iid)
}

const untrashOne = (iid: any) => {
    return Axios.delete("/inventory/untrash/" + iid)
}

export const inventoryItemService = {
    getAll,
    
    getAllActive,
    getAllTrash,
    getActiveCount,
    getTrashCount,

    getMyTools,
    
    getAllActiveFromCategory,
    getAllTrashFromCategory,
    getActiveCountFromCategory,
    getTrashCountFromCategory,

    getAllModelsFromCategory,

    getOne,
    addOne,
    editOne,
    trashOne,
    untrashOne
}