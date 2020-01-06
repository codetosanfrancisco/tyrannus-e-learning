import axiosInstance from "../../axios/axiosInstance";

const loginUser = (email, password) => {
    return axiosInstance.post("/users/login", {
        email,
        password
    })
}

export default loginUser;

