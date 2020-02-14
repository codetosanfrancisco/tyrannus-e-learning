import axiosInstance from "../../../axios/axiosInstance";

const submitFile = (sessionId, file) => {
    return axiosInstance.post(`/file/${sessionId}/new`, file)
}

export default submitFile;