import axiosInstance from "../../axios/axiosInstance";

const sendMessage = (email, body, dbName, sessionId) => {
    return axiosInstance.post(`/message/${sessionId}`, {
        email,
        body,
        dbName
    })
}

export default sendMessage;

