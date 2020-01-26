import axiosInstance from "../../axios/axiosInstance";

const getWaiting = (sessionId, dbName='Startup') => {
    return axiosInstance.post(`/waiting/${sessionId}/loggedin-participants`, {
        dbName
    });
}

export default getWaiting;