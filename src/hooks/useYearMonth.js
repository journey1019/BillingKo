import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// 기본 날짜 설정 함수 (오늘 날짜, 1년 전)
const getDefaultYearMonth = () => {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    return {
        selectedDate: today,
        startDate: oneYearAgo,
        endDate: today
    };
};

// 문자열 또는 Date 객체를 Date 객체로 변환하는 함수
const parseYearMonth = (input) => {
    if (input instanceof Date) return input;
    if (typeof input === 'string' && input.length === 6) {
        const year = Number(input.slice(0, 4));
        const month = Number(input.slice(4, 6)) - 1;
        return new Date(year, month, 1); // 명확히 1일로 고정
    }
    return getDefaultYearMonth().selectedDate;
};

const formatToYearMonth = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}${month}`;
};

const useYearMonth = (initialInput) => {
    const navigate = useNavigate();
    const defaults = getDefaultYearMonth();
    const parsedDate = parseYearMonth(initialInput);

    const [selectedDate, setSelectedDate] = useState(parsedDate);
    const [startDate, setStartDate] = useState(defaults.startDate);
    const [endDate, setEndDate] = useState(defaults.endDate);


    // ✅ UTC로 변환하지 않고 로컬 날짜 기반으로 계산
    const yearMonth = useMemo(() => formatToYearMonth(selectedDate), [selectedDate]);
    const start_index = useMemo(() => formatToYearMonth(startDate), [startDate]);
    const end_index = useMemo(() => formatToYearMonth(endDate), [endDate]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleStartDateChange = (date) => {
        if (date instanceof Date && !isNaN(date)) {
            setStartDate(date);
        }
    };

    const handleEndDateChange = (date) => {
        if (date instanceof Date && !isNaN(date)) {
            setEndDate(date);
        }
    };

    // console.log('✅ start_index:', start_index, ' end_index:', end_index);

    return {
        selectedDate,
        setSelectedDate,
        yearMonth,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        start_index,
        end_index,
        handleDateChange,
        handleStartDateChange,
        handleEndDateChange,
        navigate,
    };
};

export default useYearMonth;
