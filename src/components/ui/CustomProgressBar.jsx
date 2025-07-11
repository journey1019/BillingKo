import { useMemo } from 'react';
import { formatNumber, formatYearMonth } from '@/utils/formatHelpers.jsx';
import Popover from '@/components/ui/Popover.jsx';
import { useNavigate } from "react-router-dom";
import { Tooltip, List, ListItem, ListItemText, ListSubheader, CircularProgress, Box, TextField } from '@mui/material';

const CustomProgressBar = ({ acct_num, monthlyAcctSaveData, totalUnpaidFee, confirmedFee, unpaidFee }) => {

    // 해당 미납금에는 이번달 금액이 포함되지 않는 게 맞음(아직 미납한 게 아니니까, 체크 ing)
    console.log(unpaidFee) // 현재 남은 미납금

    if(!monthlyAcctSaveData) return null;
    // ✅ `monthlyAcctSaveData`가 없을 경우 빈 배열을 사용하여 오류 방지
    const unconfirmedData = (monthlyAcctSaveData ?? []).filter(item => item.confirm_yn === "N");

    // 총 미수금 (미납금 + 연체 가산금)
    const totalNonePayFee = useMemo(() =>
            (monthlyAcctSaveData ?? [])
                .reduce((sum, item) => sum + (item.none_pay_fee ?? 0), 0), // ✅ 총 미수금 합산
        [monthlyAcctSaveData, acct_num]
    );

    // 미납 잔액
    const currentNonePayFee = useMemo(() =>
            (monthlyAcctSaveData ?? [])
                .filter(item => item.confirm_yn === "N")
                .reduce((sum, item) => sum + (item.unpaid_balance_fee ?? 0), 0), // ✅ 현재 남은 미수금 합산
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
    // console.log(progress)


    return(
        <div className="flex flex-col py-4">
            <div className="bg-white rounded-2xl shadow-md">
                <h1 className="p-4 bg-neutral-200 rounded-t-2xl text-lg font-semibold">
                    {acct_num} 총 미수금 현황
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

                <Box className="flex flex-col md:flex-row gap-4 py-2 px-2">
                    <Box className="bg-gray-100 text-gray-800 border border-gray-300 rounded-md p-3 w-full md:w-1/3">
                        <div className="text-sm font-medium">💰 총 미납금</div>
                        <div className="text-xl font-bold">{formatNumber(totalUnpaidFee)} 원</div>
                    </Box>
                    <Box className="bg-blue-50 text-blue-800 border border-blue-200 rounded-md p-3 w-full md:w-1/3">
                        <div className="text-sm font-medium">💳 납부 완료 금액</div>
                        <div className="text-xl font-bold">{formatNumber(confirmedFee)} 원</div>
                    </Box>
                    {/** 현재까지 남은 미납금 - 이번달 미납 잔액은 아직 미납금이 아님 */}
                    <Box className="bg-red-50 text-red-800 border border-red-200 rounded-md p-3 w-full md:w-1/3">
                        <div className="text-sm font-medium">🧾 미납 금액</div>
                        <div className="text-xl font-bold">{formatNumber(unpaidFee)} 원</div>
                    </Box>
                </Box>
            </div>
        </div>
    )
}
export default CustomProgressBar;