import { fetchKOMonthlyAccountSaveIndexData, fetchPaymentConfirm } from '@/service/monthlyAccountService.js';
import useApiFetch from '@/hooks/useApiFetch.js';
import useYearMonth from '@/hooks/useYearMonth.js';
import MonthPicker from '@/components/time/MonthPicker.jsx';
import { formatNumber } from '@/utils/formatHelpers.jsx';
import { useState, useEffect } from 'react';
import Popover from '@/components/layout/Popover.jsx';

/**
 * @desc: 납부현황 체크
 * */
const PaymentStatus = () => {
    const { selectedDate, handleDateChange, yearMonth } = useYearMonth();
    const { data: monthlyAcctSaveData = [], loading, error } = useApiFetch(fetchKOMonthlyAccountSaveIndexData, yearMonth);


    // ✅ `paymentData` 상태 관리
    const [paymentData, setPaymentData] = useState([]);

    // ✅ `monthlyAcctSaveData`가 변경될 때 `paymentData` 업데이트
    useEffect(() => {
        if (monthlyAcctSaveData?.length > 0) {
            setPaymentData(
                monthlyAcctSaveData.map(account => ({
                    acct_num: account.acct_num,
                    confirm_yn: account.confirm_yn === "Y", // 체크박스 (Boolean 변환)
                    confirm_payment_method: account.confirm_payment_method || "",
                    confirm_payment_bank: account.confirm_payment_bank || "",
                    confirm_payment_desc: account.confirm_payment_desc || "",
                }))
            );
        }
    }, [monthlyAcctSaveData]); // `monthlyAcctSaveData` 변경 시 실행

    // ✅ 전체 선택(Select All) 상태 계산
    const isAllSelected = paymentData.length > 0 && paymentData.every(account => account.confirm_yn);
    const isPartialSelected = paymentData.some(account => account.confirm_yn) && !isAllSelected;

    // ✅ 개별 체크박스 변경 핸들러
    const handleCheckboxChange = (index) => {
        setPaymentData(prevData =>
            prevData.map((item, i) =>
                i === index ? { ...item, confirm_yn: !item.confirm_yn } : item
            )
        );
    };

    // ✅ 전체 선택 체크박스 핸들러
    const handleSelectAll = () => {
        const newStatus = !isAllSelected; // 전체 선택 여부 반전
        setPaymentData(prevData =>
            prevData.map(item => ({ ...item, confirm_yn: newStatus }))
        );
    };


    return (
        <div className="flex flex-col py-4">
            <div className="bg-white rounded-2xl shadow-md">
                <div className="flex flex-row justify-between bg-neutral-200 rounded-t-2xl items-center px-4 py-2">
                    <h1 className="text-lg font-semibold">납부 현황</h1>
                    <MonthPicker value={selectedDate} onDateChange={handleDateChange} />
                </div>

                <div className="p-4 items-center text-center">
                    {monthlyAcctSaveData?.length > 0 ? (
                        <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-md">
                            <table className="w-full text-sm text-center border-collapse">
                                <thead className="bg-gray-200 sticky -top-0.5 z-10">
                                <tr>
                                    {['번호', '고객 번호', '고객 이름', '최종 납부 금액', '납부 확인', '납부 방법', '납부 은행', '납부 설명'].map((header, index) => (
                                        <th key={index} className="p-2 border font-medium">
                                            {header === '납부 확인' ? (
                                                <div className="flex justify-center items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={isAllSelected}
                                                        onChange={handleSelectAll}
                                                        className="cursor-pointer"
                                                        indeterminate={isPartialSelected ? 'true' : undefined} // 일부 선택 시 중간 상태
                                                    />
                                                </div>
                                            ) : (
                                                header
                                            )}
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {(Array.isArray(paymentData) ? paymentData : [])
                                    .sort((a, b) => (b.acct_num || '').localeCompare(a.acct_num || '')) // 문자열 내림차순 정렬
                                    .map((account, index) => (
                                        <tr key={`cdr-uploaded-${index}`} className="text-center text-sm">
                                            <td className="py-2 border">{index + 1}</td>
                                            <td className="py-2 border">{account.acct_num}</td>
                                            <td className="py-2 border">{monthlyAcctSaveData[index].account_info.acct_name}</td>

                                            {/* ✅ 최종 납부 금액 Cell + Popover */}
                                            <Popover data={monthlyAcctSaveData[index]}>
                                                {formatNumber(monthlyAcctSaveData[index].final_fee)}원
                                            </Popover>

                                            {/* ✅ 개별 체크박스 (납부 확인) */}
                                            <td className="py-2 border">
                                                <input
                                                    type="checkbox"
                                                    checked={account.confirm_yn}
                                                    onChange={() => handleCheckboxChange(index)}
                                                    className="cursor-pointer"
                                                />
                                            </td>

                                            {/* ✅ Select (납부 방법) */}
                                            <td className="p-2 border">
                                                <select
                                                    value={account.confirm_payment_method}
                                                    onChange={(e) => handleSelectChange(index, "confirm_payment_method", e.target.value)}
                                                    className="border rounded-md px-1 py-1 text-sm"
                                                >
                                                    <option value="">선택</option>
                                                    <option value="account">계좌이체</option>
                                                    <option value="giro">지로</option>
                                                    <option value="card">카드</option>
                                                </select>
                                            </td>

                                            {/* ✅ Select (납부 은행) */}
                                            <td className="p-2 border">
                                                <select
                                                    value={account.confirm_payment_bank}
                                                    onChange={(e) => handleSelectChange(index, "confirm_payment_bank", e.target.value)}
                                                    className="border rounded-md px-1 py-1 text-sm"
                                                >
                                                    <option value="">선택</option>
                                                    <option value="shinhan">신한은행</option>
                                                    <option value="nh">농협은행</option>
                                                    <option value="kb">국민은행</option>
                                                    <option value="hana">하나은행</option>
                                                </select>
                                            </td>

                                            <td className="p-2 border">{account.confirm_payment_desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-md">
                            <table className="w-full text-sm text-center border-collapse">
                                <thead className="bg-gray-200 sticky -top-0.5 z-10">
                                <tr>
                                    {['번호', '고객 번호', '고객 이름', '최종 납부 금액', '납부 확인', '납부 방법', '납부 은행', '납부 설명'].map((header, index) => (
                                        <th key={index} className="px-2 py-1 border font-medium">{header}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                <tr className="text-center text-sm">
                                    <td colSpan={8} className="py-4 border text-gray-500">디바이스 정보 없음</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                <button
                    onClick={() => console.log('Post API 전송')}
                    className="mb-4 mx-4 float-right px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md">
                    Save
                </button>
            </div>
        </div>
    );
}

export default PaymentStatus;
