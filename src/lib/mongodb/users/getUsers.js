import axiosInstance from "../../axios/axiosInstance";

const getUsers = (role) => {
    return axiosInstance.post("/users/all", { role })
}

export default getUsers;