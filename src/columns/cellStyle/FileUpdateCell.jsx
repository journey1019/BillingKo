import React from 'react';

export const YearMonthCell_Type = ({ cell }) => {
    const value = cell.getValue(); // 예: 202412

    // value를 연도와 월로 분리하는 함수
    const parseYearMonth = (cellValue) => {
        if (!cellValue) return '-'; // 값이 없을 경우 대체

        const year = Math.floor(cellValue / 100);  // 202412 → 2024
        const month = (cellValue % 100).toString().padStart(2, '0'); // 202412 → 12 (01~09월일 경우 0 추가)

        return `${year}-${month}`;
    };

    return <span>{parseYearMonth(value)}</span>;
};

export const UseYorNCell_Type = ({cell}) => {
    const value = cell.getValue();
    return (
        <span className={`px-2 py-1 text-white rounded-md ${value === 'Y' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {value}
                </span>
    );
}