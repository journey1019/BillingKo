import { useState, useRef } from "react";

const Popover = ({ data, children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const popoverRef = useRef(null);

    return (
        <td
            className="p-2 border relative"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}

            {/* ✅ Popover Tooltip */}
            {isVisible && (
                <div
                    ref={popoverRef}
                    role="tooltip"
                    className="absolute z-20 w-72 text-sm text-gray-500 bg-white border border-gray-400 rounded-lg shadow-xs dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800 transition-opacity duration-300"
                    style={{
                        top: "100%",
                        left: "100%", // 셀 오른쪽에 배치
                        transform: "translateY(-50%)", // Y축 정렬
                        marginLeft: "10px", // 약간의 간격 추가
                    }}
                >
                    <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{data.acct_num}</p>
                    </div>
                    <div className="px-3 py-2 break-words">
                        <p><strong>고객 번호:</strong> {data.acct_num}</p>
                        <p><strong>고객 이름:</strong> {data.account_info?.acct_name}</p>
                        <p><strong>납부 금액:</strong> {data.final_fee}원</p>
                        <p><strong>납부 방법:</strong> {data.confirm_payment_method || "미정"}</p>
                        <p><strong>납부 은행:</strong> {data.confirm_payment_bank || "미정"}</p>
                    </div>
                </div>
            )}
        </td>
    );
};

export default Popover;
