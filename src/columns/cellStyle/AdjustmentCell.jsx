import React from 'react';
import clsx from 'clsx';
import useAdjustmentMappings from '@/hooks/useAdjustmentMappings.js';


export const AdjustmentCell_Code = ({ cell }) => {
    const codeMappings = useAdjustmentMappings();

    const value = cell.getValue() || ''; // 값이 없으면 빈 문자열로 초기화
    const normalizedValue = value.toLowerCase().replace(/[^a-z0-9]/gi, ''); // 특수문자 제거 및 소문자로 변환

    // 조건에 따른 동적 클래스 설정
    const cellClass = clsx({
        'bg-green-100 text-green-800': normalizedValue.includes('account'), // "account" 포함 여부
        'bg-blue-100 text-blue-800': normalizedValue.includes('ppid'), // "ppid" 포함 여부
        'bg-yellow-100 text-yellow-800':
            normalizedValue.includes('device') || normalizedValue.includes('serialnumber'), // "device" 또는 "serial_number" 포함 여부
    });

    // return <span className={`px-2 py-1 rounded-md ${cellClass}`}>{value}</span>;
    return <span className={`px-2 py-1 rounded-md`}>{codeMappings.adjustment_code[value] || value}</span>;
};

export const AdjustmentCell_Category = ({ cell }) => {
    const codeMappings = useAdjustmentMappings();
    const value = cell.getValue();

    // 첫 글자만 대문자로 변환
    const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    const capitalizedValue = capitalizeFirstLetter(value);

    const cellClass = clsx({
        'bg-purple-100 text-purple-800': capitalizedValue === 'Subscribe',
        'bg-red-100 text-red-800': capitalizedValue === 'Overpayment',
        'bg-yellow-100 text-yellow-800': capitalizedValue === 'Nonpayment',
        'bg-green-100 text-green-800': capitalizedValue === 'VMS',
    });

    // return <span className={`px-2 py-1 rounded-md ${cellClass}`}>{capitalizedValue}</span>;
    return <span className={`px-2 py-1 rounded-md`}>{codeMappings.adjustment_category[value] || value}</span>;
};

export const AdjustmentCell_Type = ({ cell }) => {
    const value = cell.getValue();
    const colorClass = value === 'Discount' ? 'text-green-500' : 'text-red-500';

    return <span className={`font-bold ${colorClass}`}>{value}</span>;
};

export const AdjustmentCell_Mount_Value = ({ cell }) => {
    const value = cell.getValue();

    // 천 단위 쉼표 추가 함수
    const formatNumber = (num) => num.toLocaleString();

    let formattedValue;
    if (value % 1 === 0) {
        // 정수인 경우 천 단위 쉼표 추가
        formattedValue = formatNumber(parseInt(value));
    } else {
        // 소수점이 있는 경우 '%'
        formattedValue = `${parseFloat(value).toFixed(2)}%`;
    }

    return <span>{formattedValue}</span>;
};


export const AdjustmentCell_Cycle = ({ cell }) => {
    const value = cell.getValue();

    const CycleStyle = (value === 'monthly' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')

    return (
        <span className={`px-2 py-1 rounded ${CycleStyle}`}>
            {value}
        </span>
    );
};


export const AdjustmentCell_Use = ({ cell }) => {
    const value = cell.getValue();

    return (
        <span className={`px-2 py-1 rounded-full ${value === 'Y' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {value}
        </span>
    );
};

