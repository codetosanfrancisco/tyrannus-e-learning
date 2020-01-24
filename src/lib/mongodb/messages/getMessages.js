import axiosInstance from "../../axios/axiosInstance";

const getMessages = (dbName, sessionId) => {
    return axiosInstance.post(`/messages/${sessionId}`)
}

export default getMessages;

