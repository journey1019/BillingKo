// stores/koMonthlyAccountStore.js
import { create } from 'zustand';
import {
    fetchKOMonthlyAccountSaveIndexData,
    fetchKOMonthlyAccountSaveIndexDetailData,
} from '@/service/monthlyAccountService';
import { fetchInvoicePrint } from '@/service/invoiceService';

const useKOMonthlyAccountSaveStore = create((set, get) => ({
    yearMonth: '',
    setYearMonth: (value) => set({ yearMonth: value }),

    // 청구서 양식
    invoiceBasicData: null,
    invoiceBasicLoading: false,
    invoiceBasicError: null,

    // 전체 청구 데이터
    monthlyAcctSaveData: [],
    monthlyAcctSaveLoading: false,
    monthlyAcctSaveError: null,

    // 선택된 Row
    selectedRowData: null,
    isExpanded: false,

    // 상세 청구 데이터
    monthlyAcctSaveDetailData: null,
    monthlyAcctSaveDetailLoading: false,
    monthlyAcctSaveDetailError: null,

    fetchInvoiceBasicData: async () => {
        set({ invoiceBasicLoading: true, invoiceBasicError: null });
        try {
            const data = await fetchInvoicePrint();
            set({ invoiceBasicData: data });
        } catch (err) {
            set({ invoiceBasicError: err });
        } finally {
            set({ invoiceBasicLoading: false });
        }
    },

    fetchMonthlyAcctSaveData: async () => {
        const { yearMonth } = get();
        if (!yearMonth) return;
        set({ monthlyAcctSaveLoading: true, monthlyAcctSaveError: null });
        try {
            const data = await fetchKOMonthlyAccountSaveIndexData(yearMonth);
            set({ monthlyAcctSaveData: data });
        } catch (err) {
            set({ monthlyAcctSaveError: err });
        } finally {
            set({ monthlyAcctSaveLoading: false });
        }
    },

    fetchMonthlyAcctSaveDetailData: async (acct_num) => {
        const { yearMonth } = get();
        if (!acct_num || !yearMonth) return;
        set({ monthlyAcctSaveDetailLoading: true, monthlyAcctSaveDetailError: null });
        try {
            const detail = await fetchKOMonthlyAccountSaveIndexDetailData(yearMonth, acct_num);
            set({ monthlyAcctSaveDetailData: detail });
        } catch (err) {
            set({ monthlyAcctSaveDetailError: err });
        } finally {
            set({ monthlyAcctSaveDetailLoading: false });
        }
    },

    setSelectedRowData: (row) => {
        const { selectedRowData } = get();
        if (selectedRowData?.acct_num === row.acct_num) {
            set({ selectedRowData: null, isExpanded: false });
        } else {
            set({ selectedRowData: row, isExpanded: true });
        }
    },

    resetSelection: () =>
        set({
            selectedRowData: null,
            isExpanded: false
        }),
}));

export default useKOMonthlyAccountSaveStore;