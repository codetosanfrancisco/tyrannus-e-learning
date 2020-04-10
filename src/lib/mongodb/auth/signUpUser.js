import axiosInstance from "../../axios/axiosInstance";

const signUpUser = (name, email, password) => {
    window.console.log(email, password)
    return axiosInstance.post("/user/signUp", {
        name, 
        email,
        password,
    })
}

export default signUpUser;

