import { create } from 'zustand';
import { fetchKOMonthlyAccountSaveIndexData, fetchKOMonthlyAccountSaveIndexHistoryData, fetchKOMonthlyAccountSaveIndexAllHistoryData, fetchPaymentConfirm, fetchAccountPayment } from '@/service/monthlyAccountService';

/**
 * @desc fetchKOMonthlyAccountSaveIndexData: 이달의 모든 고객 납부현황 데이터 불러오기 (조회)
 * @desc fetchKOMonthlyAccountSaveIndexHistoryData: 고객의 최근 납부방법 데이터 불러오기 (체크박스)
 * @desc fetchKOMonthlyAccountSaveIndexAllHistoryData: 고객 납부현황 히스토리 불러오기 (1년치)
 * */
const usePaymentStore = create((set, get) => ({
    monthlyAcctSaveData: [],
    loading: false,
    error: null,

    // 고객별 납부 이력 데이터
    accountPaymentData: [],
    accountPaymentLoading: false,
    accountPaymentError: null,

    // 고객별 납부 히스토리 데이터
    accountPaymentHistoryData: [],
    accountPaymentHistoryLoading: false,
    accountPaymentHistoryError: null,

    // 고객별 납부 히스토리 디테일 데이터
    accountPaymentHistoryDetailData: [],
    accountPaymentHistoryDetailLoading: false,
    accountPaymentHistoryDetailError: null,

    fetchMonthlyAcctSaveData: async (yearMonth) => {
        set({ loading: true, error: null });
        try {
            const data = await fetchKOMonthlyAccountSaveIndexData(yearMonth);
            set({ monthlyAcctSaveData: data });
        } catch (error) {
            set({ error });
        } finally {
            set({ loading: false });
        }
    },

    updateConfirmStatus: async (yearMonth, updatedList) => {
        console.log(updatedList);
        set({ loading: true, error: null });
        try {
            await fetchPaymentConfirm(yearMonth, updatedList);
            // 업데이트 후 최신 데이터 다시 불러오기
            await get().fetchMonthlyAcctSaveData(yearMonth);
        } catch (error) {
            set({ error });
        } finally {
            set({ loading: false });
        }
    },

    fetchAccountPaymentHistoryData: async (account_num) => {
        set({ accountPaymentLoading: true, accountPaymentError: null });
        try {
            const data = await fetchAccountPayment(account_num);
            set({ accountPaymentData: data });
        } catch (error) {
            set({ accountPaymentError: error.message });
        } finally {
            set({ accountPaymentLoading: false });
        }
    },

    fetchAccountPaymentHistory: async (account_num, start_index, end_index) => {
        set({ accountPaymentHistoryLoading: true, accountPaymentHistoryError: null });
        try {
            const data = await fetchKOMonthlyAccountSaveIndexAllHistoryData(account_num, start_index, end_index);
            set({ accountPaymentHistoryData: data });
        } catch (error) {
            set({ accountPaymentHistoryError: error.message });
        } finally {
            set({ accountPaymentHistoryLoading: false });
        }
    },

    fetchAccountPaymentHistoryDetail: async (account_num, date_index) => {
        set({ accountPaymentHistoryDetailLoading: true, accountPaymentHistoryDetailError: null });
        try {
            const data = await fetchKOMonthlyAccountSaveIndexAllHistoryData(account_num, date_index);
            set({ accountPaymentHistoryDetailData: data });
        } catch (error) {
            set({ accountPaymentHistoryDetailError: error.message });
        } finally {
            set({ accountPaymentHistoryDetailLoading: false });
        }
    },
}));

export default usePaymentStore;
