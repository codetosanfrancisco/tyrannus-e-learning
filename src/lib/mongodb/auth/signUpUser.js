import axiosInstance from "../../axios/axiosInstance";

const signUpUser = (email, password, dbName) => {
    window.console.log(email, password)
    return axiosInstance.post("/user/signUp", {
        email,
        password,
        dbName
    })
}

export default signUpUser;

