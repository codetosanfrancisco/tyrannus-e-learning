import axiosInstance from "../../axios/axiosInstance";

const logOutUser = () => {
    return axiosInstance.post("/user/logout")
}

export default logOutUser;

