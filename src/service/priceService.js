import { get } from "./api";

/**
 * 요금제 데이터 가져오기
 * @returns {Promise<object>} 서버 응답 데이터
 */
export const fetchPrices = () => get("/price");
