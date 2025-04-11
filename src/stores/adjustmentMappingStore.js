// stores/adjustmentMappingStore.js
import { create } from 'zustand';
import { fetchAdjustmentCodeName } from '@/service/adjustmentService.js';

const formatMapping = (arr) =>
    arr.reduce((acc, item) => {
        acc[item.code_value] = item.code_alias;
        return acc;
    }, {});

const useAdjustmentMappingStore = create((set) => ({
    codeMappings: {
        adjustment_code: {},
        adjustment_category: {},
        adjustment_type: {},
        mount_type: {},
        adjustment_cycle: {},
    },
    loading: false,
    error: null,

    fetchCodeMappings: async () => {
        set({ loading: true, error: null });
        try {
            const [codes, categories, types, mounts, cycles] = await Promise.all([
                fetchAdjustmentCodeName("adjustment_code"),
                fetchAdjustmentCodeName("adjustment_category"),
                fetchAdjustmentCodeName("adjustment_type"),
                fetchAdjustmentCodeName("mount_type"),
                fetchAdjustmentCodeName("adjustment_cycle"),
            ]);

            set({
                codeMappings: {
                    adjustment_code: formatMapping(codes),
                    adjustment_category: formatMapping(categories),
                    adjustment_type: formatMapping(types),
                    mount_type: formatMapping(mounts),
                    adjustment_cycle: formatMapping(cycles),
                },
                loading: false
            });
        } catch (err) {
            console.error("조정 코드 매핑 에러:", err);
            set({
                error: err.message || '코드 매핑 불러오기 실패',
                loading: false
            });
        }
    },
}));

export default useAdjustmentMappingStore;
