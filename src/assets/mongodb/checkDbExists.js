import axiosInstance from "../axios/axiosInstance";

const checkDbExists = (dbName) => {
    return axiosInstance.get("/", {
        dbName
    })
}

export default checkDbExists;