import axiosInstance from "../axios/axiosInstance";

const requestToken = () => {
    return axiosInstance.post("/request-opentok-token")
}

export default requestToken;