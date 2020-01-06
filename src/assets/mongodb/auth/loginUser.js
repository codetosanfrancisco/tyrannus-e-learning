import axiosInstance from "../../axios/axiosInstance";

const logInUser = (email, password, dbName) => {
    return axiosInstance.post("/users/login", {
        email,
        password,
        dbName
    })
}

export default logInUser;

