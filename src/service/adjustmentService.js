import { postWithBody } from "./api"; // Body
import { get, post, put, del } from "./api";

/**
 * 모든 조정 조회
 * @returns {Promise<object>} 서버 응답 데이터
 */
export const fetchAdjustment = async () => {
    try {
        return await get(`/adjustment`);
    } catch (error) {
        console.error("Failed to fetch account History:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * 모든 조정 조회
 * @returns {Promise<object>} 서버 응답 데이터
 */
export const fetchAdjustmentPart = async (code_value) => {
    try {
        return await get(`/adjustment/value/${code_value}`);
    } catch (error) {
        console.error("Failed to fetch account History:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * 새로운 조정 생성
 * @param {object} adjustment 조정 정보
 * @returns {Promise<object>} 생성된 조정 데이터
 */
export const createAdjustment = async (adjustData) => {
    // const allowedNullField = "description";

    try {
        console.log("POST 데이터:", adjustData);
        return await postWithBody("/adjustment", adjustData);
    } catch (error) {
        console.error("Failed to create adjustment", error.response?.data || error.message);
        throw error;
    }
}
