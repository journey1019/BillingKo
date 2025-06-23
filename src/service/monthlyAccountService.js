import { getWithAuth, post, postWithAuth, postWithBody } from './api';

export const fetchKOMonthlyAccountIndexData = async (year_month) => {
    try {
        return await getWithAuth(`/monthly/account/${year_month}`);
    } catch (error) {
        console.error("Failed to fetch account History:", error.response?.data || error.message);
        throw error;
    }
}


/** 최종 청구서 상세 데이터 */
export const fetchKOMonthlyAccountSaveIndexData = async (year_month) => {
    try {
        return await getWithAuth(`/monthly/saveData/account/${year_month}`);
    } catch (error) {
        console.error("Failed to fetch account History:", error.response?.data || error.message);
        throw error;
    }
}


/** 고객별 히스토리 (날짜 선택 - 납부상태 이력 확인) */
export const fetchKOMonthlyAccountSaveIndexAllHistoryData = async (acct_num, start_index, end_index) => {
    console.log("params", {start_index, end_index})
    try {
        return await getWithAuth(`/monthly/saveData/account_confirm/history/${acct_num}`, { start_index: start_index, end_index: end_index });
    } catch (error) {
        console.error("Failed to fetch account History:", error.response?.data || error.message);
        throw error;
    }
}

/** 고객별 최근 납부이력 조회 (납부방법 조회 -> 불러오기 */
export const fetchKOMonthlyAccountSaveIndexHistoryData = async (acct_num, year_month) => {
    try {
        return await getWithAuth(`/monthly/saveData/account_confirm/history_detail/${acct_num}/${year_month}`);
    } catch (error) {
        console.error("Failed to fetch account History:", error.response?.data || error.message);
        throw error;
    }
}


/** 최종 청구서 상세 데이터 */
export const fetchKOMonthlyAccountSaveIndexDetailData = async (year_month, acct_num) => {
    try {
        return await getWithAuth(`/monthly/saveData/account/sn/${year_month}/${acct_num}`);
    } catch (error) {
        console.error("Failed to fetch account History:", error.response?.data || error.message);
        throw error;
    }
}


/* Account Monthly Detail */
export const fetchKOMonthlyAccountDetailData = async (year_month, acct_num) => {
    try {
        return await getWithAuth(`/monthly/account/acct/${year_month}/${acct_num}`);
    } catch (error) {
        console.error("Failed to fetch account History:", error.response?.data || error.message);
        throw error;
    }
}



export const fetchPaymentConfirm = async (yearMonth, confirmData) => {
    try {
        console.log("📦 전송 데이터:", { yearMonth, confirmData });
        console.log("POST 데이터:", confirmData);
        return await postWithBody(`/monthly/saveData/account_confirm/${yearMonth}`, confirmData);
    } catch (error) {
        // console.error("Failed to create adjustment", error.response?.data || error.message);
        throw error;
    }
}


/** 고객에 포함된 Device 마지막 버전 정보 출력 */
export const fetchMonthlyAccountIncludeDeviceDetailData = async (year_month, serial_number) => {
    try {
        return await getWithAuth(`/monthly/saveData/sn/${year_month}/${serial_number}`);
    } catch (error) {
        // console.error("Failed to fetch account History:", error.response?.data || error.message);
        throw error;
    }
}


export const fetchAccountPayment = async (acct_num) => {
    try {
        return await getWithAuth(`/monthly/saveData/account/acct_num/${acct_num}`);
    } catch (error) {
        console.error("Failed to fetch AccountPayment", error.response?.data || error.message);
        throw error;
    }
}