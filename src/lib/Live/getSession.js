import axiosInstance from "@/lib/axios/axiosInstance";

const getSession = (id) => {
    return axiosInstance.post(`/live/${id}`)
}

export default getSession;