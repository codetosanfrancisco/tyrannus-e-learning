import axiosInstance from "../../axios/axiosInstance";

const nextSlide = (sessionId, email, fileIndex) => {
    return axiosInstance.post(`/powerpoint/${sessionId}/next`, {
        email,
        fileIndex
    })
}

export default nextSlide;

