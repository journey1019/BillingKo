import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// 기본 한 달 전 날짜 설정 함수
const getDefaultYearMonth = () => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return {
        selectedDate: oneMonthAgo,
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

const useYearMonth = (initialInput) => {
    const navigate = useNavigate();
    const parsedDate = parseYearMonth(initialInput);

    const [selectedDate, setSelectedDate] = useState(parsedDate);

    // ✅ UTC로 변환하지 않고 로컬 날짜 기반으로 계산
    const yearMonth = useMemo(() => {
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        return `${year}${month}`;
    }, [selectedDate]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    return { selectedDate, setSelectedDate, yearMonth, handleDateChange, navigate };
};

export default useYearMonth;
