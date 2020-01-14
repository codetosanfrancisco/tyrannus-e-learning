import axiosInstance from "../../axios/axiosInstance";

const logInUser = (email, password, dbName) => {
    return axiosInstance.post("/user/login", {
        email,
        password,
        dbName
    })
}

export default logInUser;

