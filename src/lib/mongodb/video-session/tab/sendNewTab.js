import axiosInstance from "../../../axios/axiosInstance";

const sendNewTab = (object,sessionId, email) => {
    return axiosInstance.post(`/tab/${sessionId}/new`, {
        ...object,
        email
    })
}

export default sendNewTab;