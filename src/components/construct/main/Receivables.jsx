import { useMemo } from 'react';
import { formatNumber, formatYearMonth } from '@/utils/formatHelpers.jsx';
import Popover from '@/components/ui/Popover.jsx';

const Receivables = ({ yearMonth, monthlyAcctSaveData }) => {
    console.log('monthlyAcctSaveData: ', monthlyAcctSaveData);

    // 총 청구 금액 (final_fee 총합)
    const totalNonePayFee = useMemo(() =>
            (monthlyAcctSaveData ?? [])
                .reduce((sum, item) => sum + (Number(item.final_fee) || 0), 0),
        [monthlyAcctSaveData, yearMonth]
    );

    // 수납액 (payment_amount_fee 총합)
    const amountPaid = useMemo(() =>
            (monthlyAcctSaveData ?? [])
                .reduce((sum, item) => sum + (Number(item.payment_amount_fee) || 0), 0),
        [monthlyAcctSaveData, yearMonth]
    );

    // 현재 남은 미수금 (confirm_yn === 'N'인 unpaid_balance_fee 총합)
    const currentNonePayFee = useMemo(() =>
            (monthlyAcctSaveData ?? [])
                .filter(item => item.confirm_yn === 'N')
                .reduce((sum, item) => sum + (Number(item.unpaid_balance_fee) || 0), 0),
        [monthlyAcctSaveData, yearMonth]
    );

    // 납부율 계산
    const progress = useMemo(() =>
            totalNonePayFee > 0 ? (amountPaid / totalNonePayFee) * 100 : 0,
        [amountPaid, totalNonePayFee]
    );
    const paymentStatusPercent = progress.toFixed(2);

    return (
        <div className="flex flex-col py-4">
            <div className="bg-white rounded-2xl shadow-md">
                <h1 className="p-4 bg-neutral-200 rounded-t-2xl text-lg font-semibold">
                    {formatYearMonth(yearMonth)} 총 미수금 현황
                </h1>

                <div className="p-4 items-center">
                    <div className="mb-2 text-sm text-gray-500 ">
                        총 청구 금액 : {formatNumber(totalNonePayFee)} 원
                    </div>
                    <Popover
                        title={(
                            <div className="flex flex-row justify-between items-center">
                                <span>총 청구금액:</span>
                                <span>{formatNumber(totalNonePayFee)} 원</span>
                            </div>
                        )}
                        content={(
                            <>
                                <div className="flex flex-row justify-between items-center">
                                    <span>수납액:</span>
                                    <span>{formatNumber(amountPaid)} 원</span>
                                </div>
                                <div className="flex flex-row justify-between items-center">
                                    <span>납부율:</span>
                                    <span>{paymentStatusPercent} %</span>
                                </div>
                            </>
                        )}
                    >
                        <div className="w-full bg-gray-200 rounded-full h-2.5 relative">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </Popover>

                    <div className="mt-4 border-b" />
                </div>

                <div className="px-4 pb-4 grid grid-cols-4 items-center space-x-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-blue-500">총 청구 금액</span>
                        <span className="text-lg">{formatNumber(totalNonePayFee)} 원</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-orange-500">수납액</span>
                        <span className="text-lg">{formatNumber(amountPaid)} 원</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-yellow-500">잔여 미수금</span>
                        <span className="text-lg">{formatNumber(currentNonePayFee)} 원</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Receivables;
