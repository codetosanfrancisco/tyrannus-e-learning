import axiosInstance from "../../../axios/axiosInstance";

const sendVideoLink = (sessionId, email, event) => {
    return axiosInstance.post(`/video/${sessionId}/sendVideoEvent`, {
        event,
        email,
    })
}

export default sendVideoLink;