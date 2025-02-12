import api, { API_URL } from './api'; // Axios 인스턴스 사용

/**
 * 사용자 로그인
 * @param {string} userId 사용자 ID
 * @param {string} userPw 사용자 PW
 * @returns {Promise<object>} 서버 응답 데이터
 */
export const login = async (userId, userPw) => {
    try {
        const response = await api.put("/user/login/", {
            user_id: userId,
            user_pw: userPw,
        });

        // 서버에서 반환된 로그인 성공 데이터
        return response.data; // {user_id, user_nm, user_token, token_expired}
    } catch (error) {
        throw new Error(
            error.response?.data?.detail || "Failed to log in. Please try again."
        );
    }
};

export const register = async (userId, userPw, userNm) => {
    try {
        const response = await fetch(`${API_URL}/user/${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: userId,
                user_pw: userPw,
                user_nm: userNm,
            }),
        });

        if (!response.ok) {
            throw new Error("회원가입 실패");
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
};
