import { useMemo, useState } from 'react';
import useAdjustmentStore from '@/stores/adjustmentStore';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import useAdjustmentMappings from '@/hooks/useAdjustmentMappings.js';
import { formatDateIndex, formatNumber, formatValue, formatAnyWithCommas } from '@/utils/formatHelpers.jsx';
import ReadOnlySwitch from '@/components/ui/switches/ReadOnlySwitch.jsx';

const EachTransactionDetailForm = ({ naming, adjustmentDetailData, adjustmentDetailLoading, adjustmentDetailError }) => {
    const isSwitchOn = adjustmentDetailData.use_yn;
    const isSwitchOnTax = adjustmentDetailData.tax_free_yn;

    const codeMappings = useAdjustmentMappings();
    console.log(adjustmentDetailData)

    const formatDisplayValue = (value) => {
        return !value || value === "null" ? "-" : value;
    };

    return (
        <>
            <div className="pt-1">
                {adjustmentDetailLoading ? (
                    <LoadingSpinner />
                ) : adjustmentDetailError ? (
                    <p className="text-red-500">{adjustmentDetailError}</p>
                ) : adjustmentDetailData ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <span className="text-sm font-semibold text-gray-600">사용 여부</span>
                            <div className="flex items-center space-x-2">
                                <ReadOnlySwitch isEnabled={isSwitchOn} labelOn="활성화" labelOff="비활성화" />
                            </div>
                            <span className="text-sm font-semibold text-gray-600">부가세</span>
                            <div className="flex items-center space-x-2">
                                <ReadOnlySwitch isEnabled={isSwitchOnTax} labelOn="계산 후" labelOff="계산 전" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { label: '조정 적용 날짜', value: formatDateIndex(adjustmentDetailData.date_index) },
                                {
                                    label: '조정 적용 주기',
                                    value: codeMappings.adjustment_cycle[adjustmentDetailData.adjustment_cycle],
                                },
                                {
                                    label: '조정 대상 구분',
                                    value: codeMappings.adjustment_code[adjustmentDetailData.adjustment_code],
                                },
                                { label: '조정 대상', value: adjustmentDetailData.adjustment_code_value },
                                {
                                    label: '조정 종류',
                                    value: codeMappings.adjustment_category[adjustmentDetailData.adjustment_category],
                                },
                                {
                                    label: '조정 타입',
                                    value: codeMappings.adjustment_type[adjustmentDetailData.adjustment_type],
                                },
                                { label: '요금 적용 기준', value: codeMappings.mount_type[adjustmentDetailData.mount_type] },
                                { label: '요금 적용 금액', value: formatNumber(adjustmentDetailData.mount_value) },
                                { label: '설명', value: adjustmentDetailData.description },
                            ].map(({ label, value }, index) => (
                                <div key={index} className="flex justify-between items-start gap-2">
                                    <label
                                        className="text-xs font-medium text-gray-500 w-1/2 2xl:w-1/3 p-1 break-words"
                                    >
                                        {label}
                                    </label>
                                    <span
                                        className="text-sm w-1/2 2xl:w-2/3 px-2 py-1 rounded-md bg-gray-100 break-words whitespace-pre-wrap"
                                    >
                                        {formatDisplayValue(value)}
                                    </span>
                                </div>
                            ))}
                        </div>

                    </div>
                ) : (
                    <p>Select an {naming} to view details</p>
                )}
            </div>
        </>
    )
}

export default EachTransactionDetailForm;