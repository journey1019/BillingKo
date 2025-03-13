import { get, postWithBody, postWithAuth } from "./api";

/**
 * 월별 데이터 가져오기
 * @param {string} yearMonth YYYYMM 형식의 날짜
 * @returns {Promise<object>} 서버 응답 데이터
 */
export const fetchMonthlyData = (yearMonth) => get(`/monthly/ko/${yearMonth}`);

export const fetchMonthlyDetailData = async (data_index, serial_number) => {
    try {
        return await get(`/monthly/ko/sn/${data_index}/${serial_number}`);
    } catch (error) {
        console.error("Failed to fetch account History:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * 월별 데이터 저장
 * @param {string} yearMonth YYYYMM 형식의 날짜
 * @param {object} data 저장할 데이터 (필요에 따라 확장 가능)
 * @returns {Promise<object>} 서버 응답 데이터
 */
// 인증 포함하여 saveMonthlyData 호출 (body 없이 요청)
export const saveMonthlyData = async (yearMonth) => {
    const endpoint = `/monthly/saveData/${yearMonth}`;
    try {
        return await postWithAuth(endpoint); // 인증 포함된 POST 요청
    } catch (error) {
        console.log("Failed to fetch", error.response?.data || error.message);
        throw error;
    }
};

/** Invoice 저장 */
export const saveInvoiceData = async (yearMonth) => {
    const endpoint = `/monthly/saveData/account_confirm/${yearMonth}`;
    try {
        return await postWithAuth(endpoint); // 인증 포함된 POST 요청
    } catch (error) {
        console.log("Failed to fetch", error.response?.data || error.message);
        throw error;
    }
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

export const fetchKOMonthlyDetailVersionIndexData = async (serial_number, version_index) => {
    try {
        return await get(`/monthly/saveData/version/${serial_number}/${version_index}`);
    } catch (error) {
        console.error("Failed to fetch account History:", error.response?.data || error.message);
        throw error;
    }
}

/**
 * @name: KO monthly save search Detail save (POST)
 * @desc: KO Monthly Save Data - Version 증가
 * */
export const saveKOMonthlyDetailData = async (dataIndex, payload) => {
    const endpoint = `/monthly/saveData/detail/${dataIndex}`;
    try {
        return await postWithAuth(endpoint, payload); // ✅ body로 payload 추가
    } catch (error) {
        console.log("Failed to fetch", error.response?.data || error.message);
        throw error;
    }
};
