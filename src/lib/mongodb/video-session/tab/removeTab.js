import axiosInstance from "../../../axios/axiosInstance";

const removeTab = (sessionId, email, index) => {
    return axiosInstance.post(`/tab/${sessionId}/remove`, {
        email,
        index
    })
}

export default removeTab;