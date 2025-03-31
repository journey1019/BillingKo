import { create } from 'zustand';
import { deleteRecentMonthly, fetchKOMonthlyDetailIndexData, fetchKOMonthlyDetailVersionIndexData } from '@/service/monthlyService';

const useDeviceMonthlyStore = create((set, get) => ({
    detailData: null,
    dProductDetail: [],
    paymentInfo: {},
    paymentFeeDetail: [],
    paymentAdjustmentInfo: [],
    version: 0,
    latestVersion: 0,

    setDetailData: (data) => {
        const payment = data.payment || {};
        const dProductDetail = ['act', 'dat', 'dct', 'mmf'].flatMap((type) =>
            (data[type] || []).map((item) => ({ type, ...item }))
        );

        set({
            detailData: data,
            dProductDetail,
            paymentInfo: payment,
            paymentFeeDetail: payment.fee_detail || [],
            paymentAdjustmentInfo: payment.adjustment_info || [],
            version: data.update_version || 0,
            latestVersion: data.update_version || 0,
        });
    },

    setVersionOnly: (v) => set({ version: v }),

    fetchDetailVersionData: async (serial_number, version_index) => {
        const response = await fetchKOMonthlyDetailVersionIndexData(serial_number, version_index);
        get().setDetailData(response);
    },

    handleDelete: async (serial_number) => {
        await deleteRecentMonthly(serial_number);
        const latest = get().latestVersion;
        const newVersion = latest - 1;
        if (newVersion >= 0) {
            await get().fetchDetailVersionData(serial_number, newVersion);
            set({ version: newVersion, latestVersion: newVersion });
        }
    }
}));

export default useDeviceMonthlyStore;
