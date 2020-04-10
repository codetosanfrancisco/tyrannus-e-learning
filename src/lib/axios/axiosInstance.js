import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.NODE_ENV == 'production' ? process.env.VUE_APP_VANILLA_SERVER : "http://localhost:8081/",
    headers: {
        'Content-Type': 'application/json',
    }
});

axiosInstance.defaults.withCredentials = true

export default axiosInstance;