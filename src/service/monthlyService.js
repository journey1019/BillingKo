import { get, postWithBody } from "./api";

/**
 * 월별 데이터 가져오기
 * @param {string} yearMonth YYYYMM 형식의 날짜
 * @returns {Promise<object>} 서버 응답 데이터
 */
export const fetchMonthlyData = (yearMonth) => get(`/monthly/ko/${yearMonth}`);


/**
 * 월별 데이터 저장
 * @param {string} yearMonth YYYYMM 형식의 날짜
 * @param {object} data 저장할 데이터 (필요에 따라 확장 가능)
 * @returns {Promise<object>} 서버 응답 데이터
 */
export const saveMonthlyData = async (yearMonth, data = {}) => {
    const endpoint = `/monthly/saveData/${yearMonth}`;
    return await postWithBody(endpoint, data);
};


/**
 * 저장된 Monthly 조회
 * @returns {Promise<object>} 서버 응답 데이터
 */
export const fetchKOMonthlyData = async (yearMonth) => {
    try {
        return await get(`/monthly/saveData/${yearMonth}`);
    } catch (error) {
        console.error("Failed to fetch account History:", error.response?.data || error.message);
        throw error;
    }
};

export const fetchKOMonthlyDetailIndexData = async (data_index) => {
    try {
        return await get(`/monthly/saveData/detail/${data_index}`);
    } catch (error) {
        console.error("Failed to fetch account History:", error.response?.data || error.message);
        throw error;
    }
};