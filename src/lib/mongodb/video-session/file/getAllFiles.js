import axiosInstance from "../../../axios/axiosInstance";

const getAllFiles = (sessionId) => {
    return axiosInstance.post(`/file/${sessionId}/all`)
}

export default getAllFiles;