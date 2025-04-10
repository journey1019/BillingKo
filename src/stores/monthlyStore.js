// stores/monthlyStore.js
import { create } from 'zustand';
import { fetchMonthlyData, fetchMonthlyDetailData, saveMonthlyData } from '@/service/monthlyService';

const useMonthlyStore = create((set, get) => ({
    // ----------------------
    // 기본 상태값
    // ----------------------
    yearMonth: '',
    setYearMonth: (value) => set({ yearMonth: value }),

    monthlyData: [],
    monthlyLoading: false,
    monthlyError: null,

    selectedRowData: null,
    isExpanded: false,

    detailData: null,
    detailLoading: false,
    detailError: null,

    // ----------------------
    // 월별 정산 데이터 조회
    // ----------------------
    fetchMonthlyData: async (yearMonth) => {
        set({ monthlyLoading: true, monthlyError: null });
        try {
            const data = await fetchMonthlyData(yearMonth);
            set({ monthlyData: data });
        } catch (error) {
            set({ monthlyError: error.message || '월별 데이터를 불러오지 못했습니다.' });
        } finally {
            set({ monthlyLoading: false });
        }
    },

    // ----------------------
    // 상세 정산 데이터 조회
    // ----------------------
    fetchDetailData: async (yearMonth, selectedRowData) => {
        if (!selectedRowData) return;

        set({ detailLoading: true, detailError: null });
        try {
            const response = await fetchMonthlyDetailData(yearMonth, selectedRowData.serial_number);
            set({ detailData: response });
        } catch (error) {
            set({ detailError: error.message || '상세 데이터를 불러오지 못했습니다.' });
        } finally {
            set({ detailLoading: false });
        }
    },

    // ----------------------
    // Row 선택 토글 (Drawer 열고 닫기)
    // ----------------------
    selectedRow: (row) => {
        const current = get().selectedRowData;
        const isSame = current?.serial_number === row.serial_number;
        set({
            selectedRowData: isSame ? null : row,
            isExpanded: !isSame,
        });
    },

    // ----------------------
    // Row 선택 초기화
    // ----------------------
    resetSelection: () => set({ selectedRowData: null, isExpanded: false }),

    // ----------------------
    // 저장 함수 (선택적)
    // ----------------------
    saveMonthlyData: async (payload) => {
        try {
            await saveMonthlyData(payload);
            // 저장 후 재조회 (선택 사항)
            const { yearMonth } = get();
            await get().fetchMonthlyData(yearMonth);
        } catch (err) {
            console.error("저장 실패:", err);
            throw err;
        }
    },
}));

export default useMonthlyStore;
