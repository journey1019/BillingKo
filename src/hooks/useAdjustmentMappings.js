import { useEffect } from "react";;
import useAdjustmentMappingStore from '@/stores/adjustmentMappingStore';

const useAdjustmentMappings = () => {
    const { codeMappings, fetchCodeMappings, fetched } = useAdjustmentMappingStore();

    useEffect(() => {
        if (!fetched) fetchCodeMappings(); // ✅ 여러번 요청하지 않도록 보호
    }, [fetched]);

    return codeMappings;
};

export default useAdjustmentMappings;
