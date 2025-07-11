import { useEffect, useState, useMemo } from "react";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { useStepperStore } from '@/stores/stepperStore.js';
import { getCurrentYearMonth, getNextYearMonth } from '@/utils/dateUtils.js';

import StepOption from '@/components/ui/step/StepOption';
import { getStepColorClass } from '@/utils/stepMapping.js';

import { hasPermission } from '@/utils/permissionUtils.js';
import CountAlertBox from '@/components/common/CountAlertBox.jsx';

const HomeProgressButton = () => {
    const currentYearMonthly = useMemo(() => getCurrentYearMonth(), []);
    const nextYearMonthly = useMemo(() => getNextYearMonth(), []);

    const nextStepMap = useStepperStore((state) => state.nextStepMap);
    const loadNextMonthSteps = useStepperStore((state) => state.loadNextMonthSteps);

    const [openStepKey, setOpenStepKey] = useState(null);

    const [alertBox, setAlertBox] = useState(null);

    const toggleDrawer = (stepKey) => {
        const userRole = localStorage.getItem("user_role");
        const isAuthorized = hasPermission("progressHome", userRole);

        if (!isAuthorized) {
            setAlertBox({
                type: "error",
                message: "이 작업은 권한이 있는 사용자만 접근할 수 있습니다.",
            });
            return;
        }

        setOpenStepKey((prev) => (prev === stepKey ? null : stepKey));
    };

    useEffect(() => {
        loadNextMonthSteps(nextYearMonthly);

    }, []);

    return(
        <div className="flex flex-row space-x-2">
            <CountAlertBox
                type={alertBox?.type}
                message={alertBox?.message}
                onClose={() => setAlertBox(null)}
            />

            <div className="flex flex-col items-start text-center w-full relative">
                <div className="flex flex-row space-x-2 items-center">
                    <span className="text-base font-medium">📆 다음 달 납입 현황</span>

                    <div
                        className={`relative flex flex-col items-center mx-4 group ${nextStepMap?.payment_confirm && 'cursor-pointer'}`}
                        onClick={() => toggleDrawer('납입 현황')}
                    >
                                <span
                                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex justify-center items-center text-[15px] ${getStepColorClass(nextStepMap?.payment || 'N')}`}>
                                    5
                                </span>
                        <span
                            className={`mt-1 text-[12px] capitalize text-indigo-800 ${nextStepMap?.payment_confirm && 'group-hover:text-indigo-500'}`}>
                                    {'납입 현황'}
                                </span>

                        {/* 툴팁 */}
                        {nextStepMap?.payment_confirm && (
                            <div
                                className="absolute top-full mt-2 right-0 bg-white border border-gray-300 shadow-md rounded-md p-2 text-xs text-gray-700 w-max max-w-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-20 text-left"
                            >
                                <div>
                                    <strong>확인 날짜:</strong>{' '}
                                    {dayjs.utc(nextStepMap.payment_confirm).add(9, 'hour').format('YYYY-MM-DD HH:mm:ss')} (KST)
                                </div>
                                <div>
                                    <strong>확인 담당자:</strong> {nextStepMap.payment_confirm_id ?? 'N/A'}
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* ✅ 넓은 영역에 Drawer 표시 */}
                {openStepKey === '납입 현황' && (
                    <div
                        className="absolute top-full right-0 w-[calc(100vw-3rem)] max-w-sm z-50 bg-white shadow-md border border-gray-200 animate-slide-down rounded-md p-4">
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                                <div className="text-sm font-semibold text-gray-800 mb-2">📌 다음달 납입 현황 단계 선택
                                </div>
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
        </div>
    )
}

export default HomeProgressButton;