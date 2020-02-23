import axiosInstance from "../../../axios/axiosInstance";

const getAllVideos = (sessionId) => {
    return axiosInstance.post(`/video/${sessionId}/all`)
}

export default getAllVideos;