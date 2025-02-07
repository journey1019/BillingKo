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
