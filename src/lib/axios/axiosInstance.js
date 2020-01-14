import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8081',
});

axiosInstance.defaults.withCredentials = true

export default axiosInstance;