import { useMemo } from 'react';
import { formatNumber, formatYearMonth } from '@/utils/formatHelpers.jsx';
import Popover from '@/components/ui/Popover.jsx';
import { useNavigate } from "react-router-dom";

const CustomProgressBar = ({ acct_num, monthlyAcctSaveData  }) => {
    if(!monthlyAcctSaveData) return null;
    // ✅ `monthlyAcctSaveData`가 없을 경우 빈 배열을 사용하여 오류 방지
    const unconfirmedData = (monthlyAcctSaveData ?? []).filter(item => item.confirm_yn === "N");

    // 총 미수금
    const totalNonePayFee = useMemo(() =>
            (monthlyAcctSaveData ?? [])
                .reduce((sum, item) => sum + (item.none_pay_fee ?? 0), 0), // ✅ 총 미수금 합산
        [monthlyAcctSaveData, acct_num]
    );

    // 현재까지 남은 미수금
    const currentNonePayFee = useMemo(() =>
            (monthlyAcctSaveData ?? [])
                .filter(item => item.confirm_yn === "N")
                .reduce((sum, item) => sum + (item.none_pay_fee ?? 0), 0), // ✅ 현재 남은 미수금 합산
        [monthlyAcctSaveData, acct_num]
    );

    console.log(totalNonePayFee - currentNonePayFee)
    console.log('monthlyAcctSaveData: ', monthlyAcctSaveData)
    console.log('unconfirmedData: ', unconfirmedData);
    console.log('totalNonePayFee: ', totalNonePayFee);
    console.log('currentNonePayFee: ', currentNonePayFee);
    // 미납료 납부 금액
    const amountPaid = totalNonePayFee - currentNonePayFee;



    // ✅ 퍼센트 계산 (totalNonePay가 0이 아닐 때만 계산)
    const progress = useMemo(() => {
        return totalNonePayFee > 0 ? (amountPaid / totalNonePayFee) * 100 : 0;
    }, [totalNonePayFee, currentNonePayFee])
    const paymentStatusPercent = progress.toFixed(2);
    console.log(progress)
    console.log(progress.toFixed(2))

    return(
        <div className="flex flex-col py-4">
            <div className="bg-white rounded-2xl shadow-md">
                <h1 className="p-4 bg-neutral-200 rounded-t-2xl text-lg font-semibold">
                    총 미수금 현황
                    {/*{formatYearMonth(yearMonth)} 총 미수금 현황*/}
                </h1>

                <div className="p-4 items-center">
                    <div className="mb-2 text-sm text-gray-500 ">총 청구 금액 : {formatNumber(totalNonePayFee) || 0} 원</div>
                    {/* ✅ Popover가 Progress Bar를 감싸지 않고, Hover 시 Popover가 보이도록 설정 */}
                    <Popover
                        title={(
                            <div className="flex flex-row justify-between items-center">
                                <span>총 미수금: </span>
                                <span>{formatNumber(totalNonePayFee)} 원</span>
                            </div>
                        )}
                        content={(
                            <>
                                <div className="flex flex-row justify-between items-center">
                                    <span>수납액: </span>
                                    <span>{formatNumber(amountPaid)} 원</span>
                                </div>
                                <div className="flex flex-row justify-between items-center">
                                    <span>납부율: </span>
                                    <span>{paymentStatusPercent} %</span>
                                </div>
                            </>
                        )}
                    >
                        {/* ✅ 항상 보이는 Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2.5 relative">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </Popover>

                    <div className="mt-4 border-b" />
                </div>

                <div className="px-4 pb-4 grid grid-cols-5 items-center space-x-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-blue-500">총 미납 금액</span>
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
export default CustomProgressBar;