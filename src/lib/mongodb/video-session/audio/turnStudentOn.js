import axiosInstance from "../../../axios/axiosInstance";

const turnStudentOn = (role, sessionId) => {
    return axiosInstance.post(`/audio/${sessionId}/turnStudentOn`, {
        role
    })
}

export default turnStudentOn;