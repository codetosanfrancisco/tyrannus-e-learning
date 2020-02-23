import axiosInstance from "../../../axios/axiosInstance";

const sendFileLink = (sessionId, email, file) => {
    return axiosInstance.post(`/video/${sessionId}/sendFileLink`, {
        file,
        email,
    })
}

export default sendFileLink;