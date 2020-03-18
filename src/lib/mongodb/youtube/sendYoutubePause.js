import axiosInstance from "../../axios/axiosInstance";

const sendYoutubePause = (sessionId,email) => {
    return axiosInstance.post(`/youtube/${sessionId}/pause`, {
        email
    })
}

export default sendYoutubePause;

