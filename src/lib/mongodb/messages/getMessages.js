import axiosInstance from "../../axios/axiosInstance";

const getMessages = (sessionId) => {
    return axiosInstance.post(`/messages/${sessionId}`)
}

export default getMessages;

