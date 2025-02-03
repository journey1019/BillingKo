import { get, post } from "./api";

/**
 * 모든 디바이스 데이터 가져오기
 * @returns {Promise<object>} 서버 응답 데이터
 */
export const fetchDevices = () => get("/devices");

/**
 * 새로운 디바이스 생성
 * @param {object} deviceData 디바이스 정보
 * @returns {Promise<object>} 생성된 디바이스 데이터
 */
export const createDevice = (deviceData) => post("/devices", deviceData);
