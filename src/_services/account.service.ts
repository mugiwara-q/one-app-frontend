import Axios from "@/_services/caller.service"

const login = (credentials: any) => {
    return Axios.post("auth/login", credentials)
}

const saveToken = (token: any) => {
    localStorage.setItem("token", token)
}

const logout = () => {
    localStorage.removeItem("token")
}

const checkRole = (askedRole: string, minRequiredRights: string[]) => {
    let token = getTokenInfo()
    minRequiredRights = minRequiredRights.concat(["rw"]) // add rw to r or w

    if (["r", "w", "rw"].includes(token.roles["admin"]) || minRequiredRights.includes(token.roles[askedRole])) { return true }

    return false
}

const isLogged = () => {
    const token = localStorage.getItem("token")
    return !!token
}

const getToken = () => {
    return localStorage.getItem("token")
}


const getTokenInfo = () => {
    const token: string | null = getToken()
    if (token === null) {
        return {}
    }
    else {
        return (JSON.parse(atob(token.split('.')[1]))) // return payload = [1]
    }
}

/*const istokenExpired = (token: any) => {
    if (!token) return true;
    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decodedToken.exp < currentTime;
    } catch (error) {
        console.error('Error decoding token:', error);
        return true;
    }
}*/

export const accountService = {
    saveToken,
    login,
    logout,
    isLogged,
    getToken,
    getTokenInfo,
    checkRole
}
