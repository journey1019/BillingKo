import { postWithBody } from "./api"; // Body
import { postWithQueryString } from "./api"; // QueryString
import { get, post, put, del } from "./api";

/**
 * 모든 계정 데이터 가져오기
 * @returns {Promise<object>} 서버 응답 데이터
 */
export const fetchAccounts = async () => {
    try {
        return await get("/accounts/");
    } catch (error) {
        console.error("Failed to fetch accounts:", error.response?.data || error.message);
        throw error;
    }
};

// /**
//  * 새로운 계정 생성
//  * @param {object} accountData 계정 정보
//  * @returns {Promise<object>} 생성된 계정 데이터
//  */
// export const createAccount = async (accountData) => {
//     try {
//         return await postWithQueryString("/accounts", accountData);
//     } catch (error) {
//         console.error("Failed to create account:", error);
//         throw error;
//     }
// };
/**
 * 새로운 계정 생성
 * @param {object} accountData 계정 정보
 * @returns {Promise<object>} 생성된 계정 데이터
 */
export const createAccount = async (accountData) => {
    // "null" 문자열이 아니라 실제 null로 변환
    if (!accountData.invoice_address2 || accountData.invoice_address2.trim() === "") {
        accountData.invoice_address2 = null;
    }

    try {
        return await postWithBody("/accounts/", accountData);
    } catch (error) {
        console.error("Failed to create account:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * 계정 수정
 * @param {string} id 수정할 계정 ID
 * @param {object} accountData 수정할 데이터
 * @returns {Promise<object>} 수정된 계정 데이터
 */
export const updateAccount = async (id, accountData) => {
    try {
        return await put(`/accounts/${id}`, accountData);
    } catch (error) {
        console.error("Failed to update account:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * 계정 삭제
 * @param {string} id 삭제할 계정 ID
 * @returns {Promise<void>} 삭제 완료
 */
export const deleteAccount = async (id) => {
    try {
        return await del(`/accounts/${id}`);
    } catch (error) {
        console.error("Failed to delete account:", error.response?.data || error.message);
        throw error;
    }
};
