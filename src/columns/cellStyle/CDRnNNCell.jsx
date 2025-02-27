import React from 'react';
import clsx from 'clsx';

export const CDRCell_Code = ({ cell }) => {
    const value = cell.getValue();

    // ✅ 값이 없을 경우 기본 스타일
    if (!value) return <span>-</span>;

    // ✅ 마지막 3글자를 추출하여 스타일 적용
    const suffix = value.slice(-3); // 'MMF', 'DAT', 'DCT' 등 추출
    const DProductStyle = clsx({
        'text-pink-400': suffix === 'ACT',
        'text-blue-400': suffix === 'MMF',
        'text-orange-400': suffix === 'DAT',
        'text-red-400': suffix === 'DCT',
        'text-green-400': suffix === 'FTW',  // 예시: STSFTW → 초록색
        'text-gray-500': !['MMF', 'DAT', 'DCT', 'FTW'].includes(suffix), // 기타 값은 회색
    });

    return <span className={DProductStyle}>{value}</span>;
};
