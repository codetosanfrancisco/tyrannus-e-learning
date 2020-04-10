import axiosInstance from "../../../axios/axiosInstance";

const sendDrawing = (data, stage, index, sessionId, email) => {
    return axiosInstance.post(`/drawing/${sessionId}/sendDrawing`, {
        data,
        stage,
        index, 
        email
    })
}

export default sendDrawing;