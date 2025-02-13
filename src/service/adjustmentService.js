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
export const fetchAdjustmentPart = async (adjustment_index) => {
    try {
        return await get(`/adjustment/${adjustment_index}`);
    } catch (error) {
        console.error("Failed to fetch account History:", error.response?.data || error.message);
        throw error;
    }
};


/**
 * Value에 해당하는 조정 조회
 * @returns {Promise<object>} 서버 응답 데이터
 */
export const fetchAdjustmentValue = async (code_value) => {
    try {
        return await get(`/adjustment/value/${code_value}`);
    } catch (error) {
        console.error("Failed to fetch account History:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Value에 대한 모든 조정 이력 조회
 * @returns {Promise<object>} 서버 응답 데이터
 */
export const fetchAdjustmentValueHistory = async (code_value) => {
    try {
        return await get(`/adjustment/history/value/${code_value}`);
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
        return await postWithBody("/adjustment/", adjustData);
    } catch (error) {
        console.error("Failed to create adjustment", error.response?.data || error.message);
        throw error;
    }
}

/**
 * 조정 수정
 * @param {string} id 수정할 조정 Index
 * @param {object} adjustmentData 수정할 데이터
 * @returns {Promise<object>} 수정된 조정 데이터
 */
export const updateAdjustment = async (adjustment_index, adjustmentData) => {
    try {
        return await put(`/adjustment/${adjustment_index}`, adjustmentData);
    } catch (error) {
        console.error("Failed to update adjustment:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * 조정 삭제
 * @param {string} id 삭제할 조정 ID
 * @returns {Promise<void>} 삭제 완료
 */
export const deleteAdjustment = async (adjustment_index) => {
    try {
        return await del(`/adjustment/${adjustment_index}`);
    } catch (error) {
        console.error("Failed to delete adjustment:", error.response?.data || error.message);
        throw error;
    }
};
