import { postWithBody } from "./api"; // Body
import { get, post, put, del } from "./api";

/**
 * 모든 계정 데이터 가져오기
 * @returns {Promise<object>} 서버 응답 데이터
 */
export const fetchPrice = async () => {
    try {
        return await get("/price/");
    } catch (error) {
        console.error("Failed to fetch price:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * 특정 계정 이력 조회
 * @param {string} ppid - 조회할 계정의 ppid
 * @returns {Promise<object>} 서버 응답 데이터
 */
export const fetchPricePart = async (ppid) => {
    try {
        return await get(`/price/${ppid}`);
    } catch (error) {
        console.error("Failed to fetch price History:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * 새로운 계정 생성
 * @param {object} priceData 계정 정보
 * @returns {Promise<object>} 생성된 계정 데이터
 */
export const createPrice = async (priceData) => {
    // 허용된 null 필드만 변환
    const allowedNullFields = ["remarks", "note"];

    Object.keys(priceData).forEach((key) => {
        if (allowedNullFields.includes(key) && (priceData[key] === null || priceData[key]?.trim() === "")) {
            priceData[key] = null;
        }
    });

    try {
        console.log("POST 데이터:", JSON.stringify(priceData, null, 2));  // 디버깅
        return await postWithBody("/price/", priceData);
    } catch (error) {
        console.error("Failed to create price:", error.response?.data || error.message);
        throw error;
    }
};



/**
 * 계정 수정
 * @param {string} id 수정할 계정 ID
 * @param {object} priceData 수정할 데이터
 * @returns {Promise<object>} 수정된 계정 데이터
 */
export const updatePrice = async (ppid, priceData) => {
    try {
        return await put(`/price/${ppid}`, priceData);
    } catch (error) {
        console.error("Failed to update price:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * 계정 삭제
 * @param {string} id 삭제할 계정 ID
 * @returns {Promise<void>} 삭제 완료
 */
export const deletePrice = async (ppid) => {
    try {
        return await del(`/price/${ppid}`);
    } catch (error) {
        console.error("Failed to delete price:", error.response?.data || error.message);
        throw error;
    }
};
