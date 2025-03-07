import { postWithBody, postWithBodyFile } from "./api"; // Body
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



/**
 * 특정 단말 Account 변경 이력 조회
 * @ChangeLog
 * @param {string} serial_number - 조회할 단말의 serial_number
 * @returns {Promise<object>} 서버 응답 데이터
 */
export const fetchDeviceHistoryLog = async (serial_number) => {
    try {
        return await get(`/devices/changed/${serial_number}`);
    } catch (error) {
        console.error("Failed to fetch device History:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * 특정 단말 Account 변경
 * @param {string} id 수정할 단말 ID
 * @param {object} deviceData 수정할 데이터
 * @returns {Promise<object>} 수정된 단말 데이터
 */
export const updateDeviceHistoryLog = async (deviceData) => {
    try {
        return await put(`/devices/changed/`, deviceData);
    } catch (error) {
        console.error("Failed to update device:", error.response?.data || error.message);
        throw error;
    }
};


/**
 * 변경 이력 삭제
 * @param {string} id 삭제할 단말 ID
 * @returns {Promise<void>} 삭제 완료
 */
export const deleteDeviceHistoryLog = async () => {
    try {
        return await del(`/devices/changed/`);
    } catch (error) {
        console.error("Failed to delete device:", error.response?.data || error.message);
        throw error;
    }
};



const mapErrorToUserMessage = (errorDetail) => {
    if (errorDetail.includes('list index out of range')) {
        return '파일 형식이 잘못되었습니다. 데이터가 누락되었거나 잘못된 구조일 수 있습니다.';
    }
    if (errorDetail.includes('duplicate key value violates unique constraint')) {
        return '파일에 중복된 데이터가 포함되어 있습니다. 중복 데이터를 제거한 후 다시 업로드하세요.';
    }
    return '알 수 없는 오류가 발생했습니다. 관리자에게 문의하세요.';
};

/**
 * @desc: Device Upload File
 * */
export const uploadDevicesFile = async (files) => {
    const uploadPromises = Array.from(files).map((file) => {
        const formData = new FormData();
        formData.append('file', file);

        // ✅ FormData 값 디버깅 로그 추가
        for (const pair of formData.entries()) {
            console.log(`FormData Key: ${pair[0]}, Value:`, pair[1]);
        }

        return postWithBodyFile("/file/deviceUpload", formData);
    });

    try {
        return await Promise.all(uploadPromises); // ✅ 모든 파일 업로드 완료 시까지 대기
    } catch (error) {
        const errorDetail = error.response?.data?.error || '파일 업로드 중 문제가 발생했습니다.';
        const userFriendlyMessage = mapErrorToUserMessage(errorDetail);
        throw new Error(userFriendlyMessage);
    }
};

