import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; // Django API URL

// Axios 인스턴스 생성
const api = axios.create({
    baseURL: API_URL,
});

// 요청 인터셉터
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token && !config.url.includes("/user/login/")) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
