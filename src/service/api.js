import axios from "axios";

// export const API_URL = "http://127.0.0.1:8000"; // Django API URL
export const API_URL = "http://112.168.252.12:29455";

// Axios 인스턴스 생성
const api = axios.create({
    baseURL: API_URL,
    timeout: 10000, // 요청 타임아웃 설정 (5초)
    headers: {
        "Content-Type": "application/json",
    },
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
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                console.error("Unauthorized: Invalid or expired token.");
                // 필요 시 토큰 갱신 로직 추가
            }
        }
        return Promise.reject(error);
    }
);
// api.interceptors.response.use(
//     (response) => response,
//     handleError
// );

// 공통 메서드
// GET 요청
export const get = async (url, params = {}) => {
    const response = await api.get(url, { params });
    return response.data;
};

// ✅ 인증된 GET 요청 (Authorization 헤더 추가)
export const getWithAuth = async (url, params = {}) => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("❌ 인증이 필요합니다. 로그인 후 다시 시도하세요.");
    }

    try {
        const response = await api.get(url, {
            params,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            redirect: "follow", // 🚀 자동 리다이렉트 처리
        });

        return response.data;
    } catch (error) {
        console.error("❌ API 요청 실패:", error.response?.data || error.message);
        throw error;
    }
};

// POST 요청
export const post = async (url, body) => {
    console.log("POST Body:", body); // POST 요청 데이터 확인
    const response = await api.post(url, body);
    return response.data;
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

export const postWithBodyFile = async (url, body) => {
    const token = localStorage.getItem("token");

    const response = await api.post(url, body, {
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}), // ✅ Content-Type 제거
        },
    });

    return response.data;
};

// 인증이 필요한 POST 요청 (토큰 포함)
export const postWithAuth = async (url, body = null) => {
    const token = localStorage.getItem("token"); // 로컬스토리지에서 토큰 가져오기

    if (!token) {
        throw new Error("Authentication token is missing.");
    }

    const response = await api.post(url, body, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // 인증 헤더 추가
        },
    });

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