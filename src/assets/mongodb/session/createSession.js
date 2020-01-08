import axiosInstance from "../../axios/axiosInstance";

const createSession = (sessionTitle) => {
    axiosInstance.post("/session/create", {
        sessionTitle
    })
}

export default createSession;