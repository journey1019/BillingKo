import { useState, useEffect } from 'react';
import { fetchAdjustmentCodeName } from '@/service/adjustmentService';

const useAdjustmentOptionLoader = (setFormData = null, enableDefault = false) => {
    const [adjustmentCategories, setAdjustmentCategories] = useState([]);
    const [adjustmentTypes, setAdjustmentTypes] = useState([]);
    const [mountTypes, setMountTypes] = useState([]);
    const [adjustmentCycles, setAdjustmentCycles] = useState([]);

    useEffect(() => {
        const loadOptions = async () => {
            try {
                const [categories, types, mounts, cycles] = await Promise.all([
                    fetchAdjustmentCodeName('adjustment_category'),
                    fetchAdjustmentCodeName('adjustment_type'),
                    fetchAdjustmentCodeName('mount_type'),
                    fetchAdjustmentCodeName('adjustment_cycle'),
                ]);

                setAdjustmentCategories(categories || []);
                setAdjustmentTypes(types || []);
                setMountTypes(mounts || []);
                setAdjustmentCycles(cycles || []);

                // ✅ 기본값 설정이 필요한 경우
                if (enableDefault && setFormData) {
                    setFormData((prev) => ({
                        ...prev,
                        adjustment_category: categories?.[0]?.code_value || '',
                        adjustment_type: types?.[0]?.code_value || '',
                        mount_type: mounts?.[0]?.code_value || '',
                        adjustment_cycle: cycles?.[0]?.code_value || '',
                    }));
                }
            } catch (error) {
                console.error("옵션 로딩 실패:", error);
                setAdjustmentCategories([]);
                setAdjustmentTypes([]);
                setMountTypes([]);
                setAdjustmentCycles([]);
            }
        };

        loadOptions();
    }, []);

    return {
        adjustmentCategories,
        adjustmentTypes,
        mountTypes,
        adjustmentCycles,
    };
};

export default useAdjustmentOptionLoader;
