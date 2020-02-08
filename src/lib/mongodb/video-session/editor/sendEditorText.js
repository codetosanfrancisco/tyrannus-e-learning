import axiosInstance from "../../../axios/axiosInstance";

const sendEditorText = (data, boardNumber = 1, sessionId, email) => {
    return axiosInstance.post(`/editorText/${sessionId}/sendEditorText`, {
        data,
        boardNumber, 
        email
    })
}

export default sendEditorText;