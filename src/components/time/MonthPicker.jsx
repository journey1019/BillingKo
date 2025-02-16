import React, { forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MonthPicker = ({ value, onDateChange, placeholder = "Select month" }) => {
    // Custom Input 컴포넌트
    const CustomInput = forwardRef(({ value, onClick }, ref) => (
        <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center pl-3 pointer-events-none">
                <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                </svg>
            </div>
            <input
                ref={ref}
                value={value}
                onClick={onClick}
                placeholder={placeholder}
                readOnly
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
            />
        </div>
    ));

    return (
        <div className="relative z-10"> {/* ✅ z-index 수정 */}
            <DatePicker
                selected={value}
                onChange={onDateChange}
                dateFormat="yyyy-MM" // 연도-월 형식
                showMonthYearPicker // 월과 연도만 선택
                customInput={<CustomInput />} // 사용자 정의 Input 사용
                popperPlacement="bottom-start" // ✅ 달력 위치 고정
                popperProps={{
                    modifiers: [
                        {
                            name: "preventOverflow",
                            options: {
                                boundary: "window",
                            },
                        },
                    ],
                }}
                containerClassName="react-datepicker-container" // ✅ popper 위치 조정
                portalId="month-picker-portal" // ✅ 포털을 사용하여 달력이 최상위에 위치
            />
        </div>
    );
};

export default MonthPicker;
