import React, { forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const MonthPicker = ({ value, onDateChange, placeholder = "Select month" }) => {
    const today = new Date(); // 현재 날짜 가져오기

    // Custom Input 컴포넌트
    const CustomInput = forwardRef(({ value, onClick }, ref) => (
        <div className="relative w-32"> {/* ✅ 너비를 제한 */}
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
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
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-11 p-2.5"
            />
        </div>
    ));

    // 전달로 이동
    const handlePreviousMonth = () => {
        const prevMonth = new Date(value);
        prevMonth.setMonth(prevMonth.getMonth() - 1);
        onDateChange(prevMonth);
    };

    // 다음 달로 이동
    const handleNextMonth = () => {
        const nextMonth = new Date(value);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        if (nextMonth > today) {
            alert("You cannot select a future date.");
            return;
        }

        onDateChange(nextMonth);
    };

    return (
        <div className="flex items-center space-x-1 z-10"> {/* ✅ 간격 축소 */}
            {/* 왼쪽 화살표 */}
            <button
                type="button"
                onClick={handlePreviousMonth}
                className="p-1.5 bg-gray-200 hover:bg-gray-300 rounded-full"
            >
                <FiChevronLeft size={18} className="text-gray-700" />
            </button>

            {/* 월 선택기 */}
            <DatePicker
                selected={value}
                onChange={onDateChange}
                dateFormat="yyyy-MM" // 연도-월 형식
                showMonthYearPicker // 월과 연도만 선택
                customInput={<CustomInput />} // 사용자 정의 Input 사용
                maxDate={today} // 오늘 날짜까지만 선택 가능
            />

            {/* 오른쪽 화살표 */}
            <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 bg-gray-200 hover:bg-gray-300 rounded-full"
            >
                <FiChevronRight size={18} className="text-gray-700" />
            </button>
        </div>
    );
};

export default MonthPicker;
