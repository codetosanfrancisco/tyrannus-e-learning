import axiosInstance from "../../../axios/axiosInstance";

const turnStudentOff = (role, sessionId) => {
    return axiosInstance.post(`/audio/${sessionId}/turnStudentOff`, {
        role
    })
}

export default turnStudentOff;