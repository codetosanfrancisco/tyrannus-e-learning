import axiosInstance from "../../axios/axiosInstance";

const logoutSession = (sessionId, dbName='Startup', email) => {
    return axiosInstance.post(`/waiting/${sessionId}/logoutsession`, {
        email,
        dbName
    })
}

export default logoutSession;