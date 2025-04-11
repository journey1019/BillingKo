import { create } from 'zustand';
import { fetchKOMonthlyAccountIndexData, fetchKOMonthlyAccountDetailData } from '@/service/monthlyAccountService';

const useAccountMonthlyStore = create((set) => ({
    yearMonth: '',
    setYearMonth: (value) => set({ yearMonth: value }),

    monthlyAcctData: [],
    loading: false,
    error: null,

    selectedRowId: null,
    isExpanded: false,

    accountDetailData: null,
    accountDetailLoading: false,
    accountDetailError: null,

    fetchMonthlyAcctData: async (yearMonth) => {
        set({ loading: true, error: null });
        try {
            const data = await fetchKOMonthlyAccountIndexData(yearMonth);
            set({ monthlyAcctData: data });
        } catch (error) {
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

    fetchAccountDetailData: async (yearMonth, acctNum) => {
        if (!acctNum) return;

        set({ accountDetailLoading: true, accountDetailError: null });
        try {
            const detail = await fetchKOMonthlyAccountDetailData(yearMonth, acctNum);
            set({ accountDetailData: detail });
        } catch (error) {
            set({ accountDetailError: error.message });
        } finally {
            set({ accountDetailLoading: false });
        }
    },

    setSelectedRowId: (row) =>
        set({
            selectedRowId: row,
            isExpanded: true
        }),

    selectRow: (row) =>
        set((state) => ({
            selectedRowId: state.selectedRowId?.acct_num === row.acct_num ? null : row,
            isExpanded: state.selectedRowId?.acct_num !== row.acct_num,
        })),

    resetSelection: () =>
        set({
            selectedRowId: null,
            isExpanded: false,
        }),
}));
export default useAccountMonthlyStore;
