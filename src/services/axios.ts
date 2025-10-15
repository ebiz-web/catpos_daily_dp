import Axios from "axios";

export const axios = Axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    withCredentials: true,
});

axios.interceptors.response.use(
    response => response.data,
    (error) => {
        console.log("INTERCEPTOR : ", error);
        return Promise.reject(error);
    }
);
