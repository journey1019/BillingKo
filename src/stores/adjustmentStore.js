import { create } from 'zustand';
import { fetchAdjustment, fetchAdjustmentPart, fetchAdjustmentValue, fetchAdjustmentValueHistory, deleteAdjustment } from '@/service/adjustmentService.js';
import { updateAdjustment } from '../service/adjustmentService.js';

const useAdjustmentStore = create((set, get) => ({
    // 전체 조정 데이터
    adjustmentData : [],
    adjustmentLoading: false,
    adjustmentError: null,

    // 조정 세부 데이터
    adjustmentDetailData: [],
    adjustmentDetailLoading: false,
    adjustmentDetailError: null,

    // 현재 조정 세부 데이터
    adjustmentValueData: [],
    adjustmentValueLoading: false,
    adjustmentValueError: null,

    // 현재 조정 세부 데이터 이력 데이터
    adjustmentDetailHistoryData: [],
    adjustmentDetailHistoryLoading: false,
    adjustmentDetailHistoryError: null,


    // 전체 조정 데이터
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

    // 테이블 데이터 (adjustment_index 기반 데이터)
    fetchAdjustmentDetailData: async (value) => {
        set({ adjustmentDetailLoading: true, adjustmentDetailError: null });
        try {
            const data = await fetchAdjustmentPart(value); // 이건 service의 fetch 함수
            set({ adjustmentDetailData: data });
        } catch (error) {
            set({ adjustmentDetailError: error.message });
        } finally {
            set({ adjustmentDetailLoading: false });
        }
    },

    // Account에 대한 이력 데이터
    fetchAdjustmentValueData: async (value) => {
        set({ adjustmentValueLoading: true, adjustmentValueError: null });
        try {
            const valueData = await fetchAdjustmentValue(value); // service 함수
            set({ adjustmentValueData: valueData });
        } catch (error) {
            set({ adjustmentValueError: error.message });
        } finally {
            set({ adjustmentValueLoading: false });
        }
    },

    fetchAdjustmentValueHistory: async (value) => {
        set({ adjustmentDetailHistoryLoading: true, adjustmentDetailHistoryError: null });
        try {
            const history = await fetchAdjustmentValueHistory(value); // service 함수
            set({ adjustmentDetailHistoryData: history });
        } catch (error) {
            set({ adjustmentDetailHistoryError: error.message });
        } finally {
            set({ adjustmentDetailHistoryLoading: false });
        }
    },


    // 삭제
    deleteAdjustmentData: async (adjustment_index) => {
        try {
            await deleteAdjustment(adjustment_index);
        } catch (error) {
            throw error;
        }
    },

    // 수
    updateAdjustmentData: async (adjustment_index, payload) => {
        try {
            await updateAdjustment(adjustment_index, payload);
        } catch (err) {
            throw err;
        }
    },
}));

export default useAdjustmentStore;