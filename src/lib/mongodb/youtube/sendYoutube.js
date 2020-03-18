import axiosInstance from "../../axios/axiosInstance";

const sendYoutube = (sessionId, id, email) => {
    return axiosInstance.post(`/youtube/${sessionId}/url`, {
        id,
        email
    })
}

export default sendYoutube;

