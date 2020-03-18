import axiosInstance from "../../axios/axiosInstance";

const sendYoutubePlay = (sessionId, email) => {
    return axiosInstance.post(`/youtube/${sessionId}/play`, {
        email
    })
}

export default sendYoutubePlay;

