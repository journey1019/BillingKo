import { useState, useEffect } from "react";
import { fetchAdjustmentCodeName } from '@/service/adjustmentService.js';

const useAdjustmentMappings = () => {
    const [codeMappings, setCodeMappings] = useState({
        adjustment_code: {},
        adjustment_category: {},
        adjustment_type: {},
        mount_type: {},
        adjustment_cycle: {},
    });

    useEffect(() => {
        const loadAdjustmentAliases = async () => {
            try {
                const [codes, categories, types, mounts, cycles] = await Promise.all([
                    fetchAdjustmentCodeName("adjustment_code"),
                    fetchAdjustmentCodeName("adjustment_category"),
                    fetchAdjustmentCodeName("adjustment_type"),
                    fetchAdjustmentCodeName("mount_type"),
                    fetchAdjustmentCodeName("adjustment_cycle"),
                ]);

                // ✅ 코드 데이터를 `{ code_value: code_alias }` 형태로 변환하여 저장
                const formatMapping = (arr) =>
                    arr.reduce((acc, item) => {
                        acc[item.code_value] = item.code_alias;
                        return acc;
                    }, {});

                setCodeMappings({
                    adjustment_code: formatMapping(codes),
                    adjustment_category: formatMapping(categories),
                    adjustment_type: formatMapping(types),
                    mount_type: formatMapping(mounts),
                    adjustment_cycle: formatMapping(cycles),
                });
            } catch (error) {
                console.error("조정 코드 데이터를 가져오는데 실패했습니다:", error);
                setCodeMappings({
                    adjustment_code: {},
                    adjustment_category: {},
                    adjustment_type: {},
                    mount_type: {},
                    adjustment_cycle: {},
                });
            }
        };

        loadAdjustmentAliases();
    }, []);

    return codeMappings;
};

export default useAdjustmentMappings;
