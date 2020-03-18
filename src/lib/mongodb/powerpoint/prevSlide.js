import axiosInstance from "../../axios/axiosInstance";

const prevSlide = (sessionId, email) => {
    return axiosInstance.post(`/powerpoint/${sessionId}/prev`, {
        email
    })
}

export default prevSlide;

