import axiosInstance from "../../axios/axiosInstance";

const getAllSessions = () => {
    return axiosInstance.post("/sessions")
}

export default getAllSessions;