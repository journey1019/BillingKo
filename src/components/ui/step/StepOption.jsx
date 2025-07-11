import { useStepperStore } from '@/stores/stepperStore.js';
import { getStepApiKey } from '@/utils/stepMapping.js';
import { getCurrentYearMonth, getNextYearMonth } from '../../../utils/dateUtils.js';

const StepOption = ({ label, code, stepKey, onSelect }) => {
    const updateStep = useStepperStore((state) => state.updateStep);
    const loadSteps = useStepperStore((state) => state.loadSteps);
    const loadNextMonthSteps = useStepperStore((state) => state.loadNextMonthSteps);

    const handleClick = async () => {
        const apiKey = getStepApiKey(stepKey);
        if (!apiKey) return;

        // 단말별 청구서 경고
        if (stepKey === '단말별 청구서' && code === 'Y') {
            const confirmed = window.confirm(
                "'작업 완료'로 처리하면 '단말기별 정산 내역 관리' 데이터는 더 이상 수정할 수 없습니다. 진행하시겠습니까?"
            );
            if (!confirmed) return;
        }

        const postMonthly = getCurrentYearMonth();  // ✅ POST는 무조건 이번 달
        const reloadMonthly = stepKey === '납입 현황'
            ? getNextYearMonth()                    // ✅ 납입 현황은 다음달 조회
            : getCurrentYearMonth();                // ✅ 그 외는 이번달 조회

        // POST 후 GET (정확한 월 기준)
        await updateStep(postMonthly, apiKey, code);
        if (stepKey === '납입 현황') {
            await loadNextMonthSteps(reloadMonthly);
        } else {
            await loadSteps();
        }

        onSelect?.();
    };

    return (
        <button
            onClick={handleClick}
            className="px-4 py-2 rounded bg-gray-100 hover:bg-indigo-100 text-left"
        >
            {label}
        </button>
    );
};


export default StepOption;
