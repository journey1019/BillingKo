import { get, put } from "./api";

/**
 * 이벤트 발생 시 알림 발생
 * 모든 미확인 알림 데이터 가져오기
 * @returns {Promise<object>} 서버 응답 데이터
 */
export const fetchAlarm = async () => {
    try {
        return await get("/alarm");
    } catch (error) {
        console.error("Failed to fetch alarm:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * 알림 index 까지 확인 처리
 * 알람 확인 시, put을 통해 alarm index를 전송하고 해당 알람까지 확인 처리.(send 4 -> 조회 시, 5 이후 알람만 확인 -> 마지막 9 put -> 조회 시, 9 초과 알람만 확인)
 * @param {string} index 확인 알림 Index
 * @returns {Promise<object>} 수정된 계정 데이터
 */
export const updateAlarm = async (alarm_index) => {
    try {
        return await put(`/alarm/update/${alarm_index}`);
    } catch (error) {
        console.error("Failed to update alarm:", error.response?.data || error.message);
        throw error;
    }
};