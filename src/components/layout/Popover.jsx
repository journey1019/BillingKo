import { useState, useEffect, useRef } from "react";
import { formatNumber } from '@/utils/formatHelpers.jsx';

const Popover = ({ data, children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const popoverRef = useRef(null);
    const targetRef = useRef(null);

    useEffect(() => {
        if (isVisible && popoverRef.current && targetRef.current) {
            const targetRect = targetRef.current.getBoundingClientRect();
            const popoverRect = popoverRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            let top = targetRect.bottom + 5; // 기본적으로 아래로 배치
            if (top + popoverRect.height > windowHeight) {
                top = targetRect.top - popoverRect.height - 5; // 화면을 벗어나면 위쪽으로 배치
            }

            setPosition({
                top,
                left: targetRect.left + window.scrollX, // X 좌표는 변하지 않음
            });
        }
    }, [isVisible]);

    return (
        <td
            className="p-2 border relative"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            ref={targetRef} // ✅ 마우스를 올린 대상 요소 추적
        >
            {children}

            {/* ✅ Popover Tooltip */}
            {isVisible && (
                <div
                    ref={popoverRef}
                    role="tooltip"
                    className="fixed z-50 w-72 text-sm text-gray-500 bg-white border border-gray-400 rounded-lg shadow-lg dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800 transition-opacity duration-300"
                    style={{
                        top: `${position.top}px`,
                        left: `${position.left}px`,
                    }}
                >
                    <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700 text-end">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{data.acct_num}</p>
                    </div>
                    <div className="px-3 py-2 break-words">
                        <div className="grid grid-cols-3 text-end">
                            <strong className="col-span-1 text-start">단말 금액(부가세):</strong>
                            <p className="col-span-2">{formatNumber(data.total_fee)}원 ({formatNumber(data.tax_fee)}원)</p>

                            <strong className="col-span-1 text-start">절사 금액:</strong>
                            <p className="col-span-2">{formatNumber(data.cut_off_fee)}원</p>

                            <strong className="col-span-1 text-start">최종 금액:</strong>
                            <p className="col-span-2">{formatNumber(data.final_fee)}원</p>

                            <strong className="col-span-1 text-start">Byte 사용량:</strong>
                            <p className="col-span-2">{formatNumber(data.account_use_byte_total)}</p>
                        </div>
                    </div>
                </div>
            )}
        </td>
    );
};

export default Popover;
