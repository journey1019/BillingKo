import { useEffect, useState, useMemo } from "react";

import { useStepperStore } from '@/stores/stepperStore.js';
import { getCurrentYearMonth, getNextYearMonth } from '@/utils/dateUtils.js';
import { hasPermission } from '@/utils/permissionUtils.js';

import StepOption from '@/components/ui/step/StepOption';
import CountAlertBox from '@/components/common/CountAlertBox.jsx';

const ProgressButton = ({ keyTitle }) => {
    const currentYearMonthly = useMemo(() => getCurrentYearMonth(), []);

    const loadSteps = useStepperStore((state) => state.loadSteps);

    const [openStepKey, setOpenStepKey] = useState(null);

    const [alertBox, setAlertBox] = useState(null);

    const toggleDrawer = (stepKey) => {
        const userRole = localStorage.getItem("user_role");
        const isAuthorized = hasPermission("deviceInvoice", userRole);

        if (!isAuthorized) {
            setAlertBox({
                type: "error",
                message: "이 작업은 권한이 있는 사용자만 접근할 수 있습니다.",
            });
            return;
        }

        setOpenStepKey(prev => prev === stepKey ? null : stepKey);
    };


    useEffect(() => {
        loadSteps(currentYearMonthly);
    }, []);

    return (
        <div className="relative inline-block"> {/* ✅ relative 부모로 감싸기 */}
            <CountAlertBox
                type={alertBox?.type}
                message={alertBox?.message}
                onClose={() => setAlertBox(null)}
            />

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
                            <div className="text-sm font-semibold text-gray-800">단말별 청구서 단계</div>
                            <div className="text-sm font-semibold text-red-500 mb-2">* 해당 작업을 완료 처리하면 더이상 이번달 단말별 청구서 데이터를 삭제하거나 지울 수 없습니다.</div>
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
                            className="ml-4 text-gray-500 hover:text-gray-800 min-w-[48px] text-center"
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