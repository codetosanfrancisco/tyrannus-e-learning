import axiosInstance from "../../../axios/axiosInstance";

const sendDrawing = (data, boardNumber = 1, sessionId, email) => {
    return axiosInstance.post(`/drawing/${sessionId}/sendDrawing`, {
        data,
        boardNumber, email
    })
}

export default sendDrawing;