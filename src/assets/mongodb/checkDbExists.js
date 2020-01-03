import axiosInstance from "../axios/axiosInstance";

const checkDbExists = (dbName) => {
    return axiosInstance.get("/", {
        params: {dbName}
    })
}

export default checkDbExists;