import axiosInstance from "../../../axios/axiosInstance";

const sendEditorText = (data, index, sessionId, email) => {
    return axiosInstance.post(`/editorText/${sessionId}/sendEditorText`, {
        data,
        index, 
        email
    })
}

export default sendEditorText;