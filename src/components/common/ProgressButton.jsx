import { useEffect, useState, useMemo } from "react";
import StepOption from '@/components/ui/step/StepOption';
import { getCurrentYearMonth, getNextYearMonth } from '@/utils/dateUtils.js';
import { useStepperStore } from '@/stores/stepperStore.js';

const ProgressButton = ({ keyTitle }) => {
    const currentYearMonthly = useMemo(() => getCurrentYearMonth(), []);

    const loadSteps = useStepperStore((state) => state.loadSteps);

    const [openStepKey, setOpenStepKey] = useState(null);

    const toggleDrawer = (stepKey) => {
        setOpenStepKey(prev => prev === stepKey ? null : stepKey);
    };


    useEffect(() => {
        loadSteps(currentYearMonthly);
    }, []);

    return (
        <div className="relative inline-block"> {/* ✅ relative 부모로 감싸기 */}
            <div className="flex flex-row">
                <button
                    className="relative items-center p-2 cursor-pointer rounded-md border-2 border-indigo-600 text-indigo-600 hover:text-white hover:bg-indigo-600"
                    onClick={() => toggleDrawer(keyTitle)}
                >
                    단말별 청구서 작업 현황
                </button>
            </div>

            {openStepKey === keyTitle && (
                <div
                    className="absolute top-full right-0 mt-2 w-[calc(100vw-3rem)] max-w-sm z-50 bg-white shadow-md border border-gray-200 animate-slide-down rounded-md p-4"
                >
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <div className="text-sm font-semibold text-gray-800 mb-2">단말별 청구서 단계</div>
                            <div className="mt-2 flex space-x-2">
                                <StepOption label="작업 전" code="N" stepKey={openStepKey}
                                            monthly={currentYearMonthly}
                                            onSelect={() => setOpenStepKey(null)} />
                                <StepOption label="작업 중" code="U" stepKey={openStepKey}
                                            monthly={currentYearMonthly}
                                            onSelect={() => setOpenStepKey(null)} />
                                <StepOption label="작업 완료" code="Y" stepKey={openStepKey}
                                            monthly={currentYearMonthly}
                                            onSelect={() => setOpenStepKey(null)} />
                            </div>
                        </div>
                        <button
                            onClick={() => setOpenStepKey(null)}
                            className="ml-4 text-gray-500 hover:text-gray-800"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

}

export default ProgressButton;