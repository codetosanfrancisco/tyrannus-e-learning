import axiosInstance from "../../../axios/axiosInstance";

const sendSwapTab = (index,sessionId, email) => {
    return axiosInstance.post(`/tab/${sessionId}/swap`, {
        index,
        email
    })
}

export default sendSwapTab;