import axiosInstance from "../../axios/axiosInstance";

const updateUserRole = (ids, roleToAdd) => {
    return axiosInstance.post("/user/updateRole", {
        ids,
        roleToAdd
    })
}

export default updateUserRole;

