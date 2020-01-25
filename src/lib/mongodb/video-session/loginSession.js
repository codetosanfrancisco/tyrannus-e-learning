import axiosInstance from "../../axios/axiosInstance";

const loginSession = (sessionId, dbName='Startup', email, passcode) => {
    return axiosInstance.post(`/waiting/${sessionId}/loginsession`, {
        email,
        passcode,
        dbName
    })
}

export default loginSession;