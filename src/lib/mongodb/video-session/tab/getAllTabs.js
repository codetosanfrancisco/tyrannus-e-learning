import axiosInstance from "../../../axios/axiosInstance";

const getAllTabs = (sessionId) => {
    return axiosInstance.post(`/tab/${sessionId}/all`)
}

export default getAllTabs;