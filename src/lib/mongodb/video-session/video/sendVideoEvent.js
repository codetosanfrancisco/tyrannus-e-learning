import axiosInstance from "../../../axios/axiosInstance";

const sendVideoEvent = (sessionId, email, event, index) => {
    return axiosInstance.post(`/video/${sessionId}/sendVideoEvent`, {
        event,
        email,
        index
    })
}

export default sendVideoEvent;