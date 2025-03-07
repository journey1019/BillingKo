import { MdAttachMoney, MdMoneyOffCsred } from 'react-icons/md';
import { useMemo } from 'react';
import { formatNumber } from '@/utils/formatHelpers.jsx';
import { FaMountain } from "react-icons/fa6";


const PaymentSummary = ({ monthlyAcctSaveData }) => {
    console.log(monthlyAcctSaveData)
    // 총 납부 금액
    const totalAccountFinalFee = useMemo(() =>
            (monthlyAcctSaveData ?? [])
                .reduce((sum, item) => sum + (item.final_fee ?? 0), 0), // ✅ 총 미수금 합산
        [monthlyAcctSaveData]
    );
    // 총 미수금
    const totalAccountNoneFee = useMemo(() =>
            (monthlyAcctSaveData ?? [])
                .reduce((sum, item) => sum + (item.none_pay_fee ?? 0), 0), // ✅ 총 미수금 합산
        [monthlyAcctSaveData]
    );
    // 총 바이트 사용량
    const totalAccountUseBytes = useMemo(() =>
            (monthlyAcctSaveData ?? [])
                .reduce((sum, item) => sum + (item.account_use_byte_total ?? 0), 0), // ✅ 총 미수금 합산
        [monthlyAcctSaveData]
    );

    console.log(totalAccountFinalFee)

    return(
        <>
            <div className="col-span-2">
                <span className="text-xs text-gray-500">Payment Summary</span>
                <div className="flex flex-row space-x-4 items-center py-2">
                    <div className="p-2 rounded-full bg-blue-200 text-blue-500"><MdAttachMoney
                        className="w-5 h-5" /></div>
                    <span className="font-semibold">{formatNumber(totalAccountFinalFee)} 원</span>
                </div>
            </div>
            <div className="col-span-2">
                <span className="text-xs text-gray-500">Total Outstanding Receivables</span>
                <div className="flex flex-row space-x-4 items-center py-2">
                    <div className="p-2 rounded-full bg-red-200 text-red-500"><MdMoneyOffCsred
                        className="w-5 h-5" /></div>
                    <span className="font-semibold">{formatNumber(totalAccountNoneFee)} 원</span>
                </div>
            </div>
            <div className="col-span-2">
                <span className="text-xs text-gray-500">Total Bytes Usage</span>
                <div className="flex flex-row space-x-4 items-center py-2">
                    <div className="p-2 rounded-full bg-orange-200 text-orange-500"><FaMountain
                        className="w-5 h-5" /></div>
                    <span className="font-semibold">{formatNumber(totalAccountUseBytes)} bytes</span>
                </div>
            </div>
        </>
    )
}
export default PaymentSummary;