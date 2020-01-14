import axiosInstance from "../axios/axiosInstance";

const checkDbExists = (dbName) => {
    return axiosInstance.post("/", {
        dbName
    })
}

export default checkDbExists;