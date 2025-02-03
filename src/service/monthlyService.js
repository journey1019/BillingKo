import { get } from "./api";

/**
 * 월별 데이터 가져오기
 * @param {string} yearMonth YYYYMM 형식의 날짜
 * @returns {Promise<object>} 서버 응답 데이터
 */
export const fetchMonthlyData = (yearMonth) => get(`/monthly/${yearMonth}`);
