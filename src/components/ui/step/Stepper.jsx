import { useState } from "react";
import { useStepperStore } from "@/stores/stepperStore";
import StepDrawer from "./StepDrawer";
import StepOption from './StepOption.jsx';
import { getStepApiKey } from '@/utils/stepMapping.js';
import { getCurrentYearMonth, getNextYearMonth } from '@/utils/dateUtils.js';

const getStepColorClass = (stepStatus) => {
    switch (stepStatus) {
        case "Y":
            return "bg-indigo-600 text-white border border-indigo-200";
        case "U":
            return "bg-sky-300 text-white border border-sky-200";
        default:
            return "bg-gray-100 text-gray-600 border border-gray-300";
    }
};

const steps = ["납입 현황", "파일", "단말별 청구서", "고객별 청구서"];

const Stepper = () => {
    const stepMap = useStepperStore((state) => state.stepMap);
    const [openStepKey, setOpenStepKey] = useState(null);

    const toggleDrawer = (stepKey) => {
        setOpenStepKey(prev => prev === stepKey ? null : stepKey);
    };

    const firstStep = steps[0]; // 납입 현황
    const restSteps = steps.slice(1); // 파일, 단말별 청구서, 고객별 청구서

    // ✅ 상태 가져오기
    const firstStepStatus = stepMap[getStepApiKey(firstStep)];

    return (
        <div className="relative w-full">
            {/* ✅ Drawer 영역 */}
            <StepDrawer isOpen={!!openStepKey} onClose={() => setOpenStepKey(null)}>
                <div className="text-sm font-medium text-black">
                    <span>{openStepKey} 단계에 대한 세부 정보를 선택하세요.</span>
                    {openStepKey === '단말별 청구서' && (
                        <div className="text-red-500">* 해당 작업을 완료 처리하면 더이상 이번달 단말별 청구서 데이터를 삭제하거나 지울 수 없습니다.</div>
                    )}
                    <div className="mt-4 flex space-x-2">
                        <StepOption label="작업 전" code="N" stepKey={openStepKey} monthly={getCurrentYearMonth()} onSelect={() => setOpenStepKey(null)} />
                        <StepOption label="작업 중" code="U" stepKey={openStepKey} monthly={getCurrentYearMonth()} onSelect={() => setOpenStepKey(null)} />
                        <StepOption label="작업 완료" code="Y" stepKey={openStepKey} monthly={getCurrentYearMonth()} onSelect={() => setOpenStepKey(null)} />
                    </div>
                </div>
            </StepDrawer>


            <div className="flex items-start w-full text-xs text-gray-500 px-12">
                {/* Left: Step 0 */}
                <div className="flex flex-col items-center mx-4 group cursor-pointer"
                     onClick={() => toggleDrawer(firstStep)}>
                    <span
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex justify-center items-center text-[15px] group-hover:bg-indigo-600 group-hover:text-white ${getStepColorClass(firstStepStatus)}`}
                    >
                        1
                    </span>
                    <span
                        className="mt-1 text-[12px] capitalize text-white group-hover:text-indigo-300">{firstStep}</span>
                </div>

                <div className="h-10 w-px bg-gray-300 mx-10" />

                {/* Right: Step 1~N */}
                <ol className="flex flex-1 justify-between">
                    {restSteps.map((stepKey, index) => {
                        const globalIndex = index + 1;
                        const status = stepMap[getStepApiKey(stepKey)];
                        console.log(status)

                        return (
                            <li
                                key={stepKey}
                                onClick={() => toggleDrawer(stepKey)}
                                className={`relative flex-1 flex flex-col items-center cursor-pointer text-white group`}
                            >
                                {/* 라인 */}
                                {index !== restSteps.length - 1 && (
                                    <div
                                        className="hidden sm:block absolute top-1/2 left-full w-6 h-px bg-gray-200 translate-y-[-50%] -ml-2" />
                                )}

                                {/* 동그라미 + 텍스트 */}
                                <div className="flex flex-col items-center">
                                    <span
                                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex justify-center items-center text-[15px] group-hover:bg-indigo-600 group-hover:text-white ${getStepColorClass(status)} ${globalIndex === 2 ? 'border border-2 border-red-500' : ''}`}
                                    >
                                        {globalIndex + 1}
                                    </span>
                                    <span className="mt-1 text-[12px] capitalize group-hover:text-indigo-500">{stepKey}</span>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </div>
    );
};

export default Stepper;
