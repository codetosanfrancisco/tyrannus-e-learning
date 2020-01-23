import axiosInstance from "../../axios/axiosInstance";

const createSession = (data) => {
    return axiosInstance.post("/session/new", {
        session: {
            ...data
        }
    })
}

export default createSession;