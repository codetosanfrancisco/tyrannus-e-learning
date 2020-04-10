import axiosInstance from "../../axios/axiosInstance";

const prevSlide = (sessionId, email, fileIndex) => {
    return axiosInstance.post(`/powerpoint/${sessionId}/prev`, {
        email,
        fileIndex
    })
}

export default prevSlide;

