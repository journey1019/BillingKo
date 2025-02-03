import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; // Django API URL

// Axios 인스턴스 생성
const api = axios.create({
    baseURL: API_URL,
    timeout: 5000, // 요청 타임아웃 설정 (5초)
});

// POST 요청을 Query String로 전송
export const postWithQueryString = async (url, params) => {
    const response = await axios.post(`${API_URL}${url}`, null, {
        params, // Query String으로 전송
    });
    return response.data;
};

// POST 요청을 JSON Body로 전송
export const postWithBody = async (url, body) => {
    const response = await api.post(url, body, {
        headers: {
            'Content-Type': 'application/json', // JSON 전송을 명시
        },
    });
    return response.data;
};

// 요청 인터셉터
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰 가져오기
        if (token && !config.url.includes("/user/login/")) {
            config.headers.Authorization = `Bearer ${token}`; // Authorization 헤더에 토큰 추가
        }
        console.log("Request Config:", config); // 요청 디버깅
        return config;
    },
    (error) => {
        console.error("Request Error:", error);
        return Promise.reject(error);
    }
);

// 응답 인터셉터
api.interceptors.response.use(
    (response) => {
        console.log("Response Data:", response.data); // 응답 디버깅
        return response;
    },
    (error) => {
        if (error.response) {
            console.error(
                `Response Error: ${error.response.status} - ${error.response.statusText}`
            );
            console.error("Response Details:", error.response.data); // 응답 상세 확인
        } else {
            console.error("Network Error:", error.message);
        }
        return Promise.reject(error);
    }
);

// GET 요청
export const get = async (url, params = {}) => {
    const response = await api.get(url, { params });
    return response.data;
};

// POST 요청
export const post = async (url, body) => {
    console.log("POST Body:", body); // POST 요청 데이터 확인
    const response = await api.post(url, body);
    return response.data;
};

// PUT 요청
export const put = async (url, body) => {
    const response = await api.put(url, body);
    return response.data;
};

// DELETE 요청
export const del = async (url) => {
    const response = await api.delete(url);
    return response.data;
};

export default api;