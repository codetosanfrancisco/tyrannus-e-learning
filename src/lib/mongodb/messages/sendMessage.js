import axiosInstance from "../../axios/axiosInstance";

const sendMessage = (name, body, sessionId) => {
    return axiosInstance.post(`/message/${sessionId}`, {
        name,
        body
    })
}

export default sendMessage;

