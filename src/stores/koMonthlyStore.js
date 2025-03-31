import { create } from 'zustand';
import {
    fetchKOMonthlyData,
    fetchKOMonthlyDetailIndexData,
    fetchKOMonthlyDetailVersionIndexData
} from '@/service/monthlyService';

const useKOMonthlyStore = create((set, get) => ({
    yearMonth: '',

    // 전체 데이터 조회
    monthlyDeviceData: [],
    monthlyDeviceLoading: false,
    monthlyDeviceError: null,

    // 상세 보기 상태
    selectedMonthlyIndex: null,
    isExpanded: false,

    detailData: null,
    detailLoading: false,
    detailError: null,

    version: 0,
    latestVersion: 0,

    detailVersionData: null,
    detailVersionLoading: false,
    detailVersionError: null,

    setYearMonth: (value) => set({ yearMonth: value }),

    // 목록 데이터 가져오기
    fetchMonthlyData: async (yearMonth) => {
        set({ monthlyDeviceLoading: true, monthlyDeviceError: null });
        try {
            const response = await fetchKOMonthlyData(yearMonth);
            set({ monthlyDeviceData: response });
        } catch (error) {
            set({ monthlyDeviceError: error.message || 'Failed to fetch monthly data' });
        } finally {
            set({ monthlyDeviceLoading: false });
        }
    },

    // 상세 데이터 가져오기
    fetchDetailData: async (dataIndex) => {
        if (!dataIndex) return;
        set({ detailLoading: true, detailError: null });
        try {
            const result = await fetchKOMonthlyDetailIndexData(dataIndex);
            set({
                detailData: result,
                version: result.update_version || 0,
                latestVersion: result.update_version || 0,
            });
        } catch (error) {
            set({ detailError: error.message || '상세 데이터 조회 실패' });
        } finally {
            set({ detailLoading: false });
        }
    },

    // 특정 버전 조회
    fetchVersionData: async (serial_number, version_index) => {
        set({ detailVersionLoading: true, detailVersionError: null });
        try {
            const result = await fetchKOMonthlyDetailVersionIndexData(serial_number, version_index);
            set({ detailVersionData: result, version: version_index });
        } catch (error) {
            set({ detailVersionError: error.message || '버전 데이터 조회 실패' });
        } finally {
            set({ detailVersionLoading: false });
        }
    },

    // 행 선택 및 확장/축소
    selectRow: (row) => {
        const current = get().selectedMonthlyIndex;
        if (current?.data_index === row.data_index) {
            set({ selectedMonthlyIndex: null, isExpanded: false });
        } else {
            set({ selectedMonthlyIndex: row, isExpanded: true });
        }
    },

    resetSelection: () => set({ selectedMonthlyIndex: null, isExpanded: false }),
    setVersion: (v) => set({ version: v }),

}));

export default useKOMonthlyStore;
