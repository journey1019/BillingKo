import { create } from 'zustand';
import { fetchKOMonthlyAccountSaveIndexData, fetchPaymentConfirm, fetchAccountPayment } from '@/service/monthlyAccountService';

const usePaymentStore = create((set, get) => ({
    monthlyAcctSaveData: [],
    loading: false,
    error: null,

    // 고객별 납부 이력 데이터
    accountPaymentData: [],
    accountPaymentLoading: false,
    accountPaymentError: null,

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
    }
}));

export default usePaymentStore;
