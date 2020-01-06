import axiosInstance from "../../axios/axiosInstance";

const logOutUser = () => {
    return axiosInstance.post("/users/logout")
}

export default logOutUser;

