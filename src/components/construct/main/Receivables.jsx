import { useMemo } from 'react';
import { formatNumber } from '@/utils/formatHelpers.jsx';
import Popover from '@/components/ui/Popover.jsx';

const Receivables = ({ yearMonth, monthlyAcctSaveData }) => {
    // ✅ `monthlyAcctSaveData`가 없을 경우 빈 배열을 사용하여 오류 방지
    const unconfirmedData = (monthlyAcctSaveData ?? []).filter(item => item.confirm_yn === "N");

    // 총 미수금
    const totalNonePayFee = useMemo(() =>
            (monthlyAcctSaveData ?? [])
                .reduce((sum, item) => sum + (item.none_pay_fee ?? 0), 0), // ✅ 총 미수금 합산
        [monthlyAcctSaveData, yearMonth]
    );

    // 현재까지 남은 미수금
    const currentNonePayFee = useMemo(() =>
            (monthlyAcctSaveData ?? [])
                .filter(item => item.confirm_yn === "N")
                .reduce((sum, item) => sum + (item.none_pay_fee ?? 0), 0), // ✅ 현재 남은 미수금 합산
        [monthlyAcctSaveData, yearMonth]
    );

    console.log('monthlyAcctSaveData: ', monthlyAcctSaveData)
    console.log('unconfirmedData: ', unconfirmedData);
    console.log('totalNonePayFee: ', totalNonePayFee);
    console.log('currentNonePayFee: ', currentNonePayFee);


    // ✅ 퍼센트 계산 (totalNonePay가 0이 아닐 때만 계산)
    const progress = useMemo(() => {
        return totalNonePayFee > 0 ? (currentNonePayFee / totalNonePayFee) * 100 : 0;
    }, [totalNonePayFee, currentNonePayFee]);

    return(
        <div className="flex flex-col py-4">
            <div className="bg-white rounded-2xl shadow-md">
                <h1 className="p-4 bg-neutral-200 rounded-t-2xl text-lg font-semibold">총 미수금</h1>
                <div className="p-4 items-center">
                    <div className="mb-2 text-sm text-gray-500 ">Total Receivables : {formatNumber(totalNonePayFee) || 0} 원</div>
                    {/*<div className="w-full bg-gray-200 rounded-full h-2.5 text-center">*/}
                    {/*    <div*/}
                    {/*        className="bg-blue-600 h-2.5 rounded-full"*/}
                    {/*        style={{ width: `${45}%` }}*/}
                    {/*    />*/}
                    {/*</div>*/}

                    {/* ✅ Popover가 Progress Bar를 감싸지 않고, Hover 시 Popover가 보이도록 설정 */}
                    <Popover
                        title={`총 미수금: ${formatNumber(totalNonePayFee)} 원`}
                        content={`Overdue: ${formatNumber(currentNonePayFee)} 원`}
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
                        <span className="text-xs text-blue-500">CURRENT</span>
                        <span className="text-base">0 원</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-orange-500">OVERDUE</span>
                        <span className="text-base">{formatNumber(currentNonePayFee)} 원</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Receivables;