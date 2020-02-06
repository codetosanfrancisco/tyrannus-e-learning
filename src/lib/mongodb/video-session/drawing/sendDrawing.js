import axiosInstance from "../../../axios/axiosInstance";

const sendDrawing = (data, boardNumber = 1, sessionId) => {
    return axiosInstance.post(`/drawing/${sessionId}/sendDrawing`, {
        data,
        boardNumber
    })
}

export default sendDrawing;