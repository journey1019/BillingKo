import { postWithBody } from "./api"; // Body
import { get, post, put, del } from "./api";

/**
 * 모든 조정 조회
 * @returns {Promise<object>} 서버 응답 데이터
 */
export const fetchCode = async () => {
    try {
        return await get(`/codeInfo`);
    } catch (error) {
        console.error("Failed to fetch account History:", error.response?.data || error.message);
        throw error;
    }
};


/**
 * 새로운 조정 생성
 * @param {object} code 조정 정보
 * @returns {Promise<object>} 생성된 조정 데이터
 */
export const createCode = async (codeData) => {
    try {
        console.log("POST 데이터:", codeData);
        return await postWithBody("/codeInfo/", codeData);
    } catch (error) {
        console.error("Failed to create code", error.response?.data || error.message);
        throw error;
    }
}

/**
 * 조정 수정
 * @param {string} id 수정할 Code Index
 * @param {object} adjustmentData 수정할 데이터
 * @returns {Promise<object>} 수정된 Code 데이터
 */
export const updateCode = async (code_index, codeData) => {
    try {
        return await put(`/codeInfo/modification/${code_index}`, codeData);
    } catch (error) {
        console.error("Failed to update code:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * 조정 삭제
 * @param {string} id 삭제할 Code ID
 * @returns {Promise<void>} 삭제 완료
 */
export const deleteCode = async (code_index) => {
    try {
        return await del(`/codeInfo/modification/${code_index}`);
    } catch (error) {
        console.error("Failed to delete adjustment:", error.response?.data || error.message);
        throw error;
    }
};