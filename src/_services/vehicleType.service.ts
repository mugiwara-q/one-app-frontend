import Axios from "@/_services/caller.service"

const getAll = () => {
    return Axios.get("/vehicleTypes")
}

const getOne = (vid: any) => {
    return Axios.get("/vehicleTypes/" + vid)
}

// GET ACTIVE DETAILS
const getActiveCount = () => { // OLD : GET USER COUNT
    return Axios.get("/vehicleTypes/count")
}

export const vehicleTypeService = {
    getAll,
    getOne,
    getActiveCount
}