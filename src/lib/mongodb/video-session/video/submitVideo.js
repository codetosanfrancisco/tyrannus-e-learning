import axiosInstance from "../../../axios/axiosInstance";

const submitVideo = (sessionId, video) => {
    return axiosInstance.post(`/video/${sessionId}/new`, video)
}

export default submitVideo;