import { create } from 'zustand';
import {
    fetchUploadHistoryAllFiles,
    fetchUploadFileMonthly,
    fetchUploadHistoryDetailFiles,
    deleteUpload,
} from '@/service/fileService';

const useUploadStore = create((set, get) => ({
    // 상태
    uploadHistoryAllData: [],
    uploadMonthlyData: [],
    uploadHistoryDetailData: null,

    loadingAll: false,
    loadingMonthly: false,
    loadingDetail: false,
    errorAll: null,
    errorMonthly: null,
    errorDetail: null,

    selectedRowData: null,
    isExpanded: false,

    // 전체 조회
    fetchAllData: async () => {
        set({ loadingAll: true, errorAll: null });
        try {
            const data = await fetchUploadHistoryAllFiles();
            set({ uploadHistoryAllData: data });
        } catch (err) {
            set({ errorAll: err.message });
        } finally {
            set({ loadingAll: false });
        }
    },

    fetchMonthlyData: async (yearMonth) => {
        set({ loadingMonthly: true, errorMonthly: null });
        try {
            const data = await fetchUploadFileMonthly(yearMonth);
            set({ uploadMonthlyData: data });
        } catch (err) {
            set({ errorMonthly: err.message });
        } finally {
            set({ loadingMonthly: false });
        }
    },

    fetchDetailData: async (sp_id) => {
        if (!sp_id) return;
        set({ loadingDetail: true, errorDetail: null });
        try {
            const detail = await fetchUploadHistoryDetailFiles(sp_id);
            set({ uploadHistoryDetailData: detail });
        } catch (err) {
            set({ errorDetail: err.message });
        } finally {
            set({ loadingDetail: false });
        }
    },

    deleteData: async (sp_id) => {
        await deleteUpload(sp_id);
        await get().fetchAllData(); // 삭제 후 전체 데이터 새로고침
    },

    // 행 선택 핸들링
    selectRow: (row) => {
        const current = get().selectedRowData;
        if (current?.sp_id === row.sp_id) {
            set({ selectedRowData: null, isExpanded: false });
        } else {
            set({ selectedRowData: row, isExpanded: true });
        }
    },

    resetSelection: () => set({ selectedRowData: null, isExpanded: false }),
}));
export default useUploadStore;
