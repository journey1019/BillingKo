import React, { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateRangePicker = ({ startValue, endValue, onDateChange }) => {
    const [startDate, setStartDate] = useState(startValue || null);
    const [endDate, setEndDate] = useState(endValue || null);

    const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
        <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 1 1 0-2Z" />
                </svg>
            </div>
            <input
                ref={ref}
                value={value}
                onClick={onClick}
                placeholder={placeholder}
                readOnly
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
        </div>
    ));

    const handleStartDateChange = (date) => {
        setStartDate(date);
        if (onDateChange) {
            onDateChange({ startDate: date, endDate });
        }
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
        if (onDateChange) {
            onDateChange({ startDate, endDate: date });
        }
    };

    return (
        <div id="date-range-picker" className="flex items-center z-10">
            {/* Start Date */}
            <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Select date start"
                customInput={<CustomInput />}
            />
            <span className="mx-4 text-gray-500">to</span>
            {/* End Date */}
            <DatePicker
                selected={endDate}
                onChange={handleEndDateChange}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                placeholderText="Select date end"
                customInput={<CustomInput />}
            />
        </div>
    );
};

export default DateRangePicker;


// const use = () => {
//     const [dates, setDates] = useState({ startDate: "", endDate: "" });
//     // 날짜 선택
//     const handleDateChange = (updatedDates) => {
//         setDates(updatedDates);
//     };
//     return(
//         <DateRangePicker
//             startValue={dates.startDate}
//             endValue={dates.endDate}
//             onDateChange={handleDateChange}
//         />
//     )
// }