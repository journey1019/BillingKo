import { create } from 'zustand';
import { fetchAdjustment, fetchAdjustmentValue, fetchAdjustmentValueHistory } from '@/service/adjustmentService.js';
import { fetchAdjustment } from '@/service/adjustmentService.js';

const useAdjustmentStore = create((set, get) => ({
    // 전체 조정 데이터
    adjustmentData : [],
    adjustmentLoading: false,
    adjustmentError: null,

    // 현재 조정 세부 데이터
    adjustmentDetailData: [],
    adjustmentDetailLoading: false,
    adjustmentDetailError: null,

    // 현재 조정 세부 데이터 이력 데이터
    adjustmentDetailHistoryData: [],
    adjustmentDetailHistoryLoading: false,
    adjustmentDetailHistoryError: null,


    // All Data
    fetchAdjustmentData: async () => {
        set({ adjustmentLoading: true, adjustmentError: null });
        try {
            const data = await fetchAdjustment();
            set({ adjustmentData: data });
        } catch (error) {
            set({ adjustmentError: error.message || '조정 데이터를 불러오지 못했습니다.' });
        } finally {
            set({ adjustmentLoading: false });
        }
    },

    fetchAdjustmentDetails: async (value) => {
        set({
            adjustmentLoading: true,
            adjustmentError: null,
            adjustmentHistoryLoading: true,
            adjustmentHistoryError: null,
        });

        try {
            const [detail, history] = await Promise.all([
                fetchAdjustmentValue(value),
                fetchAdjustmentValueHistory(history),
            ]);

            set({
                adjustmentDetailData: detail,
                adjustmentDetailHistoryData: history,
            });
        } catch(error) {
            set({
                adjustmentDetailError: error.message,
                adjustmentHistoryError: error.message,
            });
        } finally {
            set({
                adjustmentDetailLoading: false,
                adjustmentHistoryLoading: false,
            })
        }
    }
}));

export default useAdjustmentStore;