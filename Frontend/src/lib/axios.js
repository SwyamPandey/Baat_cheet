import axios from "axios";
export const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`, // Change to http
    withCredentials: true,
});
