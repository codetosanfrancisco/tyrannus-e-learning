import axiosInstance from "../../../axios/axiosInstance";

const sendFullScreen = (sessionId, fullscreen, email) => {
    return axiosInstance.post(`/screenshare/${sessionId}/fullscreen`, {
        fullscreen,
        email
    });
}

export default sendFullScreen;