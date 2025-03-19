import React from 'react';

// ✅ `business_num` 값을 사업자번호 형식에 맞게 보여주는 컴포넌트
export const FormatBusinessNumber = ({ cell }) => {
    const value = cell.getValue() || ''; // 값이 없을 경우 빈 문자열로 초기화

    // 사업자 번호 포맷 변환 함수 (숫자만 추출 후 형식 적용)
    const formatBusinessNumber = (num) => {
        const cleanedNum = num.replace(/\D/g, ''); // 숫자만 남기기
        if (cleanedNum.length === 10) {
            return `${cleanedNum.slice(0, 3)}-${cleanedNum.slice(3, 5)}-${cleanedNum.slice(5)}`;
        }
        return num; // 길이가 맞지 않으면 원본 반환
    };

    return <span>{formatBusinessNumber(value)}</span>;
};

// ✅ `use_yn` 값을 토글 스위치로 보여주는 컴포넌트
export const FormatUseYnToggle = ({ cell }) => {
    const value = cell.getValue(); // "Y" 또는 "N"

    return (
        <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
                {/* ✅ 비활성화된 토글 (수정 불가) */}
                <input
                    type="checkbox"
                    checked={value === 'Y'}
                    disabled
                    className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800
                                rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white
                                after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300
                                after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                                peer-checked:bg-blue-600"></div>
            </label>
        </div>
    );
};

// ✅ `tel` 전화번호 포맷팅 함수 구현
export const FormatPhoneNumber = ({ cell }) => {
    const value = cell.getValue() || '';

    const cleaned = value.toString().replace(/[^0-9-]/g, ''); // 문자열 변환 후 숫자 및 '-'만 유지

    // 이미 올바른 형식이면 그대로 반환
    if (/^\d{2,3}-\d{3,4}-\d{4}$/.test(cleaned)) {
        return cleaned;
    }

    // 10자리 (지역번호 2자리)
    if (cleaned.length === 10) {
        return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }

    // 11자리 (지역번호 3자리)
    if (cleaned.length === 11) {
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
    }

    // 원본 반환 (예외적인 경우)
    return cleaned;
}

// YYYY. MM. DD.
export const formatDate = ({ cell }) => {
    const value = cell.getValue() || "-";

    return value ? new Date(value).toLocaleDateString() : '-';
}

// 'YYYY-MM-DDTHH:mm:ss' -> 'YYYY-MM-DD HH:mm:ss' (UTC 변환)
export const formatUTCDateTime = ({ cell }) => {
    const value = cell.getValue() || '-'; // 값이 없을 경우 '-'

    const dateObj = new Date(value);
    return dateObj.toISOString().replace("T", " ").split(".")[0]; // "YYYY-MM-DD HH:mm:ss"
};

// 'YYYY-MM-DDTHH:mm:ss' -> 'YYYY-MM-DD HH:mm:ss'
export const formatDateTime = ({ cell }) => {
    const value = cell.getValue() || '-'

    return value.replace("T", " "); // UTC 변환 없이 "YYYY-MM-DD HH:mm:ss" 형태로 변환
};

// 'YYYYMM' -> 'YYYY-MM'
export const formatDateIndex = ({ cell }) => {
    const value = cell.getValue() || '-';
    if (!value || value.length !== 6) return "-"; // 값이 없거나 길이가 6이 아니면 '-'

    const year = value.slice(0, 4); // 앞 4자리 (연도)
    const month = value.slice(4, 6); // 마지막 2자리 (월)

    return `${year}-${month}`;
}

// ✅ 텍스트 (왼쪽 정렬)
export const renderTextCell = ({ cell }) => (
    <div className="text-left">{cell.getValue()}</div>
);

// ✅ 숫자 (오른쪽 정렬)
export const renderNumberCell = ({ cell }) => (
    <div className="text-right">{cell.getValue().toLocaleString()}</div>
);

// ✅ 숫자 (헤더 오른쪽 정렬)
export const applyRightAlignStyles = () => ({
    muiTableHeadCellProps: {
        sx: {
            '& .Mui-TableHeadCell-Content': {
                justifyContent: "flex-end !important",
                textAlign: "right !important",
            }
        }
    },
    muiTableBodyCellProps: {
        sx: {
            textAlign: "right",
        }
    }
});
