import axiosInstance from "../../axios/axiosInstance";

const removeUserRole = (id, roleToRemove) => {
    return axiosInstance.post("/user/removeRole", {
        id,
        roleToRemove
    })
}

export default removeUserRole;

