import axiosInstance from "../../../axios/axiosInstance";

const sendVideoLink = (videoLink, sessionId, email) => {
    return axiosInstance.post(`/video/${sessionId}/sendVideoLink`, {
        videoLink,
        email,
    })
}

export default sendVideoLink;