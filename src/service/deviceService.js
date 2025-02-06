import { postWithBody } from "./api"; // Body
import { get, post, put, del } from "./api";

/**
 * 모든 단말 데이터 가져오기
 * @returns {Promise<object>} 서버 응답 데이터
 */
export const fetchDevices = async () => {
    try {
        return await get("/devices/");
    } catch (error) {
        console.error("Failed to fetch devices:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * 특정 단말 이력 조회
 * @param {string} serial_number - 조회할 단말의 serial_number
 * @returns {Promise<object>} 서버 응답 데이터
 */
export const fetchDeviceHistory = async (serial_number) => {
    try {
        return await get(`/devices/changeHist/${serial_number}`);
    } catch (error) {
        console.error("Failed to fetch device History:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * 특정 단말 조회
 * @param {string} serial_number - 조회할 단말의 serial_number
 * @returns {Promise<object>} 서버 응답 데이터
 */
export const fetchDevicePart = async (serial_number) => {
    try {
        return await get(`/devices/${serial_number}`);
    } catch (error) {
        console.error("Failed to fetch account History:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * 새로운 단말 생성
 * @param {object} deviceData 단말 정보
 * @returns {Promise<object>} 생성된 단말 데이터
 */
export const createDevice = async (deviceData) => {
    // "null" 문자열이 아니라 실제 null로 변환
    if (!deviceData.invoice_address2 || deviceData.invoice_address2.trim() === "") {
        deviceData.invoice_address2 = null;
    }

    try {
        return await postWithBody("/devices/", deviceData);
    } catch (error) {
        console.error("Failed to create device:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * 단말 수정
 * @param {string} id 수정할 단말 ID
 * @param {object} deviceData 수정할 데이터
 * @returns {Promise<object>} 수정된 단말 데이터
 */
export const updateDevice = async (serial_number, deviceData) => {
    try {
        return await put(`/devices/${serial_number}`, deviceData);
    } catch (error) {
        console.error("Failed to update device:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * 단말 삭제
 * @param {string} id 삭제할 단말 ID
 * @returns {Promise<void>} 삭제 완료
 */
export const deleteDevice = async (serial_number) => {
    try {
        return await del(`/devices/${serial_number}`);
    } catch (error) {
        console.error("Failed to delete device:", error.response?.data || error.message);
        throw error;
    }
};
