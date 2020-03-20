import axiosInstance from "../../../axios/axiosInstance";

const sendDrawing = (data, index, sessionId, email) => {
    return axiosInstance.post(`/drawing/${sessionId}/sendDrawing`, {
        data,
        index, 
        email
    })
}

export default sendDrawing;