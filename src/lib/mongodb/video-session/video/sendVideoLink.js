import axiosInstance from "../../../axios/axiosInstance";

const sendVideoLink = (sessionId, email, videoLink, index) => {
    return axiosInstance.post(`/video/${sessionId}/sendVideoLink`, {
        videoLink,
        email,
        index
    })
}

export default sendVideoLink;