// stores/monthlyKoStore.js
import { create } from 'zustand';
import {
    fetchKOMonthlyData,
    fetchKOMonthlyDetailIndexData,
    fetchKOMonthlyDetailVersionIndexData
} from '@/service/monthlyService';

const useKOMonthlyStore = create((set) => ({
    koMonthlyData: [],
    koMonthlyLoading: false,
    koMonthlyError: null,

    selectedMonthlyIndex: null,
    isExpanded: false,

    detailData: null,
    detailLoading: false,
    detailError: null,

    detailVersionData: null,
    detailVersionLoading: false,
    detailVersionError: null,

    version: 0,
    latestVersion: 0,

    fetchKOMonthlyData: async (yearMonth) => {
        set({ koMonthlyLoading: true, koMonthlyError: null });
        try {
            const data = await fetchKOMonthlyData(yearMonth);
            set({ koMonthlyData: data });
        } catch (error) {
            set({ koMonthlyError: error.message || '청구서 데이터를 불러오는 중 오류 발생' });
        } finally {
            set({ koMonthlyLoading: false });
        }
    },

    fetchDetailData: async (dataIndex) => {
        if (!dataIndex) return;
        set({ detailLoading: true, detailError: null });
        try {
            const data = await fetchKOMonthlyDetailIndexData(dataIndex);
            set({
                detailData: data,
                version: data.update_version || 0,
                latestVersion: data.update_version || 0
            });
        } catch (error) {
            set({ detailError: error.message || '디테일 데이터 로딩 실패' });
        } finally {
            set({ detailLoading: false });
        }
    },

    fetchVersionData: async (serial, version_index) => {
        set({ detailVersionLoading: true, detailVersionError: null });
        try {
            const versionData = await fetchKOMonthlyDetailVersionIndexData(serial, version_index);
            set({
                detailVersionData: versionData,
                version: version_index
            });
        } catch (error) {
            set({ detailVersionError: error.message || '버전 데이터 로딩 실패' });
        } finally {
            set({ detailVersionLoading: false });
        }
    },

    // setSelectedMonthlyIndex: (row) =>
    //     set((state) => ({
    //         selectedMonthlyIndex:
    //             state.selectedMonthlyIndex?.data_index === row.data_index ? null : row,
    //         isExpanded: state.selectedMonthlyIndex?.data_index !== row.data_index
    //     })),
    setSelectedMonthlyIndex: (row) =>
        set({
            selectedMonthlyIndex: row,
            isExpanded: true
        }),

    resetSelection: () => set({
        selectedMonthlyIndex: null,
        isExpanded: false,
    }),

    setVersion: (value) => set({ version: value })
}));

export default useKOMonthlyStore;
