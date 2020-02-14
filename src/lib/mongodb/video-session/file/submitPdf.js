import axiosInstance from "../../../axios/axiosInstance";

const submitPdf = (sessionId, pdf) => {
    return axiosInstance.post(`/pdf/${sessionId}/new`, pdf)
}

export default submitPdf;