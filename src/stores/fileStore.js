// src/stores/fileUploadStore.js
import { create } from 'zustand';
import {
    fetchUploadHistoryAllFiles,
    fetchUploadFileMonthly,
    fetchUploadHistoryDetailFiles,
    deleteUpload
} from '@/service/fileService';

const useFileUploadStore = create((set, get) => ({
    selectedRowData: null,
    isExpanded: false,
    uploadHistoryAllData: [],
    uploadMonthlyData: [],
    uploadDetailData: null,
    loading: false,
    error: null,

    setSelectedRowData: (row) => {
        const current = get().selectedRowData;
        if (current && current.sp_id === row.sp_id) {
            set({ selectedRowData: null, isExpanded: false });
        } else {
            set({ selectedRowData: row, isExpanded: true });
        }
    },

    fetchAll: async () => {
        set({ loading: true, error: null });
        try {
            const data = await fetchUploadHistoryAllFiles();
            set({ uploadHistoryAllData: data });
        } catch (error) {
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

    fetchMonthly: async (yearMonth) => {
        if (!yearMonth) return;
        set({ loading: true });
        try {
            const data = await fetchUploadFileMonthly(yearMonth);
            set({ uploadMonthlyData: data });
        } catch (error) {
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

    fetchDetail: async () => {
        const { selectedRowData } = get();
        if (!selectedRowData?.sp_id) return;
        set({ loading: true });
        try {
            const detail = await fetchUploadHistoryDetailFiles(selectedRowData.sp_id);
            set({ uploadDetailData: detail });
        } catch (error) {
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

    handleDelete: async (sp_id, showConfirm, showSuccess, showError) => {
        try {
            const result = await showConfirm('정말 삭제하시겠습니까?', '삭제하면 복구할 수 없습니다!');
            if (!result.isConfirmed) return;

            await deleteUpload(sp_id);
            showSuccess('삭제 완료', '업로드 항목이 성공적으로 삭제되었습니다!');
            get().fetchAll(); // 다시 로드
        } catch (err) {
            console.error(err);
            showError('삭제 중 오류가 발생했습니다.');
        }
    },
}));

export default useFileUploadStore;
