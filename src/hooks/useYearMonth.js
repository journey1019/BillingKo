import { useState } from "react";
import { useNavigate } from "react-router-dom";

// 기본 한 달 전 날짜 설정 함수
const getDefaultYearMonth = () => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return {
        selectedDate: oneMonthAgo,
        yearMonth: oneMonthAgo.toISOString().slice(0, 7).replace("-", ""),
    };
};

// 재사용 가능한 훅
const useYearMonth = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(getDefaultYearMonth().selectedDate);

    // yearMonth를 자동 업데이트
    const yearMonth = selectedDate.toISOString().slice(0, 7).replace("-", "");

    // 날짜 변경 핸들러
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    return { selectedDate, setSelectedDate, yearMonth, handleDateChange, navigate };
};

export default useYearMonth;
