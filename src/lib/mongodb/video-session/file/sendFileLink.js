import axiosInstance from "../../../axios/axiosInstance";

const sendFileLink = (sessionId, email, index) => {
    return axiosInstance.post(`/file/${sessionId}/sendFileLink`, {
        index,
        email,
    })
}

export default sendFileLink;