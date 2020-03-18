import axiosInstance from "../../axios/axiosInstance";

const nextSlide = (sessionId, email) => {
    return axiosInstance.post(`/powerpoint/${sessionId}/next`, {
        email
    })
}

export default nextSlide;

