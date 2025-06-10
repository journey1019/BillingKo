import React from 'react';
import useAdjustmentMappings from '@/hooks/useAdjustmentMappings.js';
import { formatDateTime, formatDisplayValue, formatValue } from '@/utils/formatHelpers.jsx';
import { FirstUpperChange, formatDateIndex } from '../../utils/formatHelpers.jsx';
import { ADJUSTMENT_HEADER_LABELS } from "@/contents/adjustmentHeader.js";

const AdjustmentPartForm = ({ adjustPartData }) => {
    const codeMappings = useAdjustmentMappings();

    // 사용 여부 토글 설정
    const isEnabled = adjustPartData.use_yn === 'Y';
    const isVATEnabled = adjustPartData.tax_free_yn === 'Y';

    // 숫자 값에 대한 포맷 함수 (천 단위 구분자)
    const formatNumber = (value) => {
        if (!value) return '-';
        if (adjustPartData.mount_type === 'percent') {
            return Number(value).toLocaleString() + ' %';
        }
        return Number(value).toLocaleString() + ' 원';
    };

    return (
        <div className="space-y-4">
            {/* ✅ 사용 여부 (토글 스타일) */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <span className="text-sm font-semibold text-gray-600">{ADJUSTMENT_HEADER_LABELS.use_yn}</span>
                <div className="flex items-center space-x-2">
                    <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isEnabled ? 'bg-blue-500' : 'bg-gray-400'
                    }`}>
                        <div
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                                isEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                    </div>
                    <span className="text-sm font-medium">{isEnabled ? 'Yes' : 'No'}</span>
                </div>
                <span className="text-sm font-semibold text-gray-600">{ADJUSTMENT_HEADER_LABELS.tax_free_yn}</span>
                <div className="flex items-center space-x-2">
                    <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isVATEnabled ? 'bg-blue-500' : 'bg-gray-400'
                    }`}>
                        <div
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                                isVATEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                    </div>
                    <span className="text-sm font-medium">{isVATEnabled ? 'Yes' : 'No'}</span>
                </div>
            </div>

            {/* ✅ 기본 정보 */}
            <h2 className="text-md font-semibold text-gray-800 border-b pb-1">조정 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                    {
                        label: ADJUSTMENT_HEADER_LABELS.adjustment_code,
                        value: <>{codeMappings.adjustment_code[adjustPartData.adjustment_code] || formatValue(adjustPartData.adjustment_code)}</>,
                    },
                    { label: '조정 대상 ID', value: adjustPartData.adjustment_code_value },
                    {
                        label: ADJUSTMENT_HEADER_LABELS.adjustment_category,
                        value: <>{codeMappings.adjustment_category[adjustPartData.adjustment_category] || formatValue(adjustPartData.adjustment_category)}</>,
                    },
                    {
                        label: ADJUSTMENT_HEADER_LABELS.adjustment_type,
                        value: <>{codeMappings.adjustment_type[adjustPartData.adjustment_type] || formatValue(adjustPartData.adjustment_type)}</>,
                    },
                    {
                        label: ADJUSTMENT_HEADER_LABELS.mount_type,
                        value: <>{codeMappings.mount_type[adjustPartData.mount_type] || formatValue(adjustPartData.mount_type)}</>,
                    },
                    { label: ADJUSTMENT_HEADER_LABELS.mount_value, value: formatNumber(adjustPartData.mount_value) },
                    { label: ADJUSTMENT_HEADER_LABELS.adjustment_cycle, value: FirstUpperChange(adjustPartData.adjustment_cycle) },
                    { label: ADJUSTMENT_HEADER_LABELS.date_index, value: formatDateIndex(adjustPartData.date_index) },
                ].map(({ label, value }, index) => (
                    <DataRow key={index} label={label} value={formatDisplayValue(value)} />
                ))}
            </div>
            <div className="col-span-3">
                <label className="text-xs 2xl:text-sm font-medium text-gray-500">{ADJUSTMENT_HEADER_LABELS.description}</label>
                <p className="mt-1 text-sm 2xl:text-md font-medium text-gray-800">{adjustPartData.description || '-'}</p>
            </div>
            {/*<div className="grid grid-cols-3 gap-4">*/}
            {/*    {[*/}
            {/*        { label: "조정 코드", value: adjustPartData.adjustment_code },*/}
            {/*        { label: "조정 코드 값", value: adjustPartData.adjustment_code_value },*/}
            {/*        { label: "조정 카테고리", value: adjustPartData.adjustment_category },*/}
            {/*        { label: "할인/가산 구분", value: adjustPartData.adjustment_type },*/}
            {/*        { label: "마운트 타입", value: adjustPartData.mount_type },*/}
            {/*        { label: "마운트 값", value: formatNumber(adjustPartData.mount_value) },*/}
            {/*        { label: "조정 주기", value: adjustPartData.adjustment_cycle },*/}
            {/*        { label: "날짜 인덱스", value: adjustPartData.date_index },*/}
            {/*    ].map(({ label, value }, index) => (*/}
            {/*        <div key={index} className="flex justify-between items-center border-b pb-2">*/}
            {/*            <span className="text-xs 2xl:text-sm font-medium text-gray-500">{label}</span>*/}
            {/*            <span className="text-sm 2xl:text-md font-semibold text-gray-800">{value || '-'}</span>*/}
            {/*        </div>*/}
            {/*    ))}*/}


            {/*    /!* ✅ 설명 (가로 전체 사용) *!/*/}
            {/*    <div className="col-span-3">*/}
            {/*        <label className="text-xs 2xl:text-sm font-medium text-gray-500">설명</label>*/}
            {/*        <p className="mt-1 text-sm 2xl:text-md font-medium text-gray-800">{adjustPartData.description || '-'}</p>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
};

// ✅ 재사용 가능한 데이터 행 컴포넌트
const DataRow = ({ label, value, fullWidth = false }) => (
    <div className={`flex justify-between items-center ${fullWidth ? 'col-span-2' : ''}`}>
        <label className="text-xs font-medium text-gray-500 w-1/3 p-1">{label}</label>
        <span className="text-sm w-2/3 px-2 py-1 rounded-md bg-gray-100">{value}</span>
    </div>
);

export default AdjustmentPartForm;
