import axiosInstance from "../../../axios/axiosInstance";

const turnMenteeOn = (role, sessionId) => {
    return axiosInstance.post(`/audio/${sessionId}/turnMenteeOn`, {
        role
    })
}

export default turnMenteeOn;