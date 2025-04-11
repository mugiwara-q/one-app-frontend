import axios from "axios"
import { accountService } from "./account.service"

/***************** SET AXIOS BACKEND ROUTE *****************/
//const a = import.meta.env.BACKEND_PORT

const Axios = axios.create({
    baseURL: import.meta.env.VITE_IS_PROD == "true" ? import.meta.env.VITE_API_SUBDOMAIN // PROD
        : "http://localhost:" + import.meta.env.VITE_BACKEND_PORT, // DEV
})

/***************** INTERCEPT TOKEN *****************/
Axios.interceptors.request.use(request => {
    if (accountService.isLogged()) {
        request.headers.Authorization = "Bearer " + accountService.getToken()
    }
    return request
})

Axios.interceptors.response.use(
    response => {
        return response || null
    },
    error => {
        if (error.response.status != undefined) {
            if (error.response.status === 401) {
                accountService.logout() // remove token
                window.location.href = "/auth/login"
            } else {
                return Promise.reject(error)
            }
        }
        else {
            console.log("CAN'T REACH SERVER")
        }
    }
)

export default Axios
