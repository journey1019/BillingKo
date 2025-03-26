import { postWithBody } from "./api"; // Body
import { get, post, put, del } from "./api";

/**
 * 모든 가격 데이터 가져오기
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
 * 가격 이력 조회
 * @param {string} ppid - 조회할 가격의 ppid
 * @returns {Promise<object>} 서버 응답 데이터
 */
export const fetchPriceHistory = async (ppid) => {
    try {
        return await get(`/price/history/${ppid}`);
    } catch (error) {
        console.error("Failed to fetch price History:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * 특정 가격 조회
 * @param {string} ppid - 조회할 가격의 ppid
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
 * 조정 이력 조회
 * @param {string} adjustment_index - 조회할 가격의 adjustment_index
 * @returns {Promise<object>} 서버 응답 데이터
 */
export const fetchAdjustment = async () => {
    try {
        return await get(`/adjustment`);
    } catch (error) {
        console.error("Failed to fetch price History:", error.response?.data || error.message);
        throw error;
    }
};


/**
 * 새로운 가격 생성
 * @param {object} priceData 가격 정보
 * @returns {Promise<object>} 생성된 가격 데이터
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
        console.error(error.response?.data?.ppid || error.message?.ppid);
        throw error;
    }
};



/**
 * 가격 수정
 * @param {string} id 수정할 가격 ID
 * @param {object} priceData 수정할 데이터
 * @returns {Promise<object>} 수정된 가격 데이터
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
 * 가격 삭제
 * @param {string} id 삭제할 가격 ID
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
