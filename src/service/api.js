import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; // Django API URL

// Axios 인스턴스 생성
const api = axios.create({
    baseURL: API_URL,
    timeout: 5000, // 요청 타임아웃 설정 (5초)
});

// 공통 에러 처리 함수
const handleError = (error) => {
    if (error.response) {
        console.error(
            `Response Error: ${error.response.status} - ${error.response.statusText}`
        );
        console.error("Response Details:", error.response.data);
    } else {
        console.error("Network Error:", error.message);
    }
    return Promise.reject(error);
};

// POST 요청을 Query String로 전송
export const postWithQueryString = async (url, params) => {
    const response = await axios.post(`${API_URL}${url}`, null, {
        params, // Query String으로 전송
    });
    return response.data;
};

// POST 요청을 JSON Body로 전송
export const postWithBody = async (url, body) => {
    const token = localStorage.getItem("token");

    const response = await api.post(url, body, {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
    return response.data;
};

// 요청 인터셉터
api.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem("token");

        // Bearer 접두사가 없는 경우 자동 추가
        if (token && !token.startsWith("Bearer ")) {
            token = `Bearer ${token}`;
        }

        if (token && !config.url.includes("/user/login/")) {
            config.headers.Authorization = token;
        }
        console.log("Request Config:", config);
        return config;
    },
    (error) => {
        console.error("Request Error:", error);
        return Promise.reject(error);
    }
);



// 응답 인터셉터
api.interceptors.response.use(
    (response) => response,
    handleError
);

// // 응답 인터셉터
// api.interceptors.response.use(
//     (response) => {
//         console.log("Response Data:", response.data); // 응답 디버깅
//         return response;
//     },
//     (error) => {
//         if (error.response) {
//             console.error(
//                 `Response Error: ${error.response.status} - ${error.response.statusText}`
//             );
//             console.error("Response Details:", error.response.data); // 응답 상세 확인
//         } else {
//             console.error("Network Error:", error.message);
//         }
//         return Promise.reject(error);
//     }
// );

// 공통 메서드
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