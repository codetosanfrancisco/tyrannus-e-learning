import axiosInstance from "../../../axios/axiosInstance";

const sendNewTab = (name,sessionId, email) => {
    return axiosInstance.post(`/tab/${sessionId}/new`, {
        name,
        email
    })
}

export default sendNewTab;