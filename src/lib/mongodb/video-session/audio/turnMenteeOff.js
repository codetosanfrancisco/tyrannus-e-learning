import axiosInstance from "../../../axios/axiosInstance";

const turnMenteeOff = (role, sessionId) => {
    return axiosInstance.post(`/audio/${sessionId}/turnMenteeOff`, {
        role
    })
}

export default turnMenteeOff;