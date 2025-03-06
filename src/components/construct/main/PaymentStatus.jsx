import { fetchKOMonthlyAccountSaveIndexData, fetchPaymentConfirm } from '@/service/monthlyAccountService.js';
import useApiFetch from '@/hooks/useApiFetch.js';
import useYearMonth from '@/hooks/useYearMonth.js';
import MonthPicker from '@/components/time/MonthPicker.jsx';
import { formatNumber } from '@/utils/formatHelpers.jsx';
import { useState, useEffect } from 'react';
import Popover from '@/components/layout/Popover.jsx';

const PaymentStatus = () => {
    const { selectedDate, handleDateChange, yearMonth } = useYearMonth();
    const { data: monthlyAcctSaveData = [], loading, error } = useApiFetch(fetchKOMonthlyAccountSaveIndexData, yearMonth);

    // ✅ 전체 데이터 상태
    const [paymentData, setPaymentData] = useState([]);
    // ✅ 선택된 Row 데이터만 저장하는 상태
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [confirmDatas, setConfirmDatas] = useState([]);

    // ✅ `monthlyAcctSaveData` 변경 시 초기 데이터 설정
    useEffect(() => {
        if (monthlyAcctSaveData?.length > 0) {
            setPaymentData(
                monthlyAcctSaveData.map(account => ({
                    acct_num: account.acct_num,
                    confirm_yn: account.confirm_yn === "Y",
                    confirm_payment_method: account.confirm_payment_method || "",
                    confirm_payment_bank: account.confirm_payment_bank || "",
                    confirm_payment_desc: account.confirm_payment_desc || "",
                }))
            );
        }
    }, [monthlyAcctSaveData]);

    // ✅ 전체 선택 상태 계산
    const isAllSelected = paymentData.length > 0 && paymentData.every(account => account.confirm_yn);
    const isPartialSelected = paymentData.some(account => account.confirm_yn) && !isAllSelected;

    // ✅ 전체 선택 체크박스 핸들러
    const handleSelectAll = () => {
        const newStatus = !isAllSelected; // 전체 선택 여부 반전
        setPaymentData(prevData =>
            prevData.map(item => ({ ...item, confirm_yn: newStatus }))
        );
    };

    // ✅ Row 클릭 시 `selectedRowData` 업데이트
    const handleRowClick = (index) => {
        const selectedAccount = paymentData[index];

        // ✅ 클릭한 Row만 `confirmDatas`로 저장
        setSelectedRowData(selectedAccount);
        setConfirmDatas([selectedAccount]);
    };

    // ✅ 개별 체크박스 변경 핸들러
    const handleCheckboxChange = (index) => {
        setPaymentData(prevData =>
            prevData.map((item, i) =>
                i === index ? { ...item, confirm_yn: !item.confirm_yn } : item
            )
        );
    };

    // ✅ Select 및 Input 변경 핸들러
    const handleSelectChange = (index, field, value) => {
        setPaymentData(prevData =>
            prevData.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        );
    };

    // ✅ 선택된 데이터만 필터링하여 POST 요청
    const handleSave = async () => {
        if (!confirmDatas.length) {
            alert("선택된 데이터가 없습니다.");
            return;
        }

        const modifiedData = confirmDatas.map(account => {
            const postData = {
                acct_num: account.acct_num,
                confirm_yn: account.confirm_yn ? "Y" : "N",
                confirm_payment_method: account.confirm_payment_method,
            };
            if (account.confirm_payment_bank) postData.confirm_payment_bank = account.confirm_payment_bank;
            if (account.confirm_payment_desc) postData.confirm_payment_desc = account.confirm_payment_desc;
            return postData;
        });

        try {
            await fetchPaymentConfirm(yearMonth, modifiedData);
            alert("납부 정보가 성공적으로 저장되었습니다.");
        } catch (error) {
            console.error("납부 정보 저장 실패:", error);
            alert("납부 정보 저장 중 오류가 발생했습니다.");
        }
    };

    console.log(selectedRowData)
    console.log(confirmDatas)
    console.log(paymentData)

    return (
        <div className="flex flex-col py-4">
            <div className="bg-white rounded-2xl shadow-md">
                <div className="flex flex-row justify-between bg-neutral-200 rounded-t-2xl items-center px-4 py-2">
                    <h1 className="text-lg font-semibold">납부 현황</h1>
                    <MonthPicker value={selectedDate} onDateChange={handleDateChange} />
                </div>

                <div className="p-4 items-center text-center">
                    <div className="grid grid-cols-11">
                        {monthlyAcctSaveData?.length > 0 ? (
                            <div
                                className={`max-h-64 overflow-y-auto border border-gray-300 rounded-md ${selectedRowData ? 'col-span-5' : 'col-span-11'}`}>

                                <table className="w-full text-sm text-center border-collapse">
                                    <thead className="bg-gray-200 sticky -top-0.5 z-10">
                                    <tr>
                                        {['번호', '고객 번호', '고객 이름', '최종 납부 금액', '납부 확인', '납부 방법', '납부 은행', '납부 설명'].map((header, index) => (
                                            <th key={index} className="p-2 border font-medium whitespace-nowrap">
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
                                    {paymentData.map((account, index) => (
                                        <tr
                                            key={index}
                                            className={`text-center text-sm cursor-pointer ${selectedRowData?.acct_num === account.acct_num ? 'bg-gray-100' : ''}`}
                                            onClick={() => handleRowClick(index)}
                                        >
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
                                                    onChange={(e) => handleSelectChange(index, 'confirm_payment_method', e.target.value)}
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
                                                    onChange={(e) => handleSelectChange(index, 'confirm_payment_bank', e.target.value)}
                                                    className="border rounded-md px-1 py-1 text-sm"
                                                >
                                                    <option value="">선택</option>
                                                    <option value="shinhan">신한은행</option>
                                                    <option value="nh">농협은행</option>
                                                    <option value="kb">국민은행</option>
                                                    <option value="hana">하나은행</option>
                                                </select>
                                            </td>

                                            {/* ✅ 설명 입력 */}
                                            <td className="p-2 border">
                                                <input
                                                    type="text"
                                                    value={account.confirm_payment_desc}
                                                    onChange={(e) => handleSelectChange(index, 'confirm_payment_desc', e.target.value)}
                                                    className="w-full border rounded-md px-2 py-1 text-sm text-center"
                                                    placeholder="설명 입력"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-md col-span-11">
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

                        {/* ✅ 두 번째 블록 (1 비율, 중앙 아이콘) → `selectedRowData` 없을 때 숨김 */}
                        {selectedRowData && confirmDatas && (
                            <div className="col-span-1 flex justify-center items-center">
                                <span className="text-2xl">🔄</span> {/* 원하는 아이콘으로 변경 가능 */}
                            </div>
                        )}

                        {/* ✅ 세 번째 블록 (4.5 비율) → `selectedRowData` 없을 때 숨김 */}
                        {selectedRowData && (
                            <div
                                className="max-h-64 overflow-y-auto border border-gray-300 rounded-md col-span-5">
                                <table className="w-full text-sm text-center border-collapse">
                                    <thead className="bg-gray-200 sticky -top-0.5 z-10">
                                    {['번호', '고객 번호', '고객 이름', '최종 납부 금액', '납부 확인', '납부 방법', '납부 은행', '납부 설명'].map((header, index) => (
                                        <th key={index} className="p-2 border font-medium whitespace-nowrap">
                                            {header}
                                        </th>
                                    ))}

                                    </thead>
                                    <tbody>
                                    {confirmDatas?.length > 0 ? (
                                        <>
                                            {confirmDatas.map((account, index) => (
                                                <tr key={index} className="text-center text-sm">
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
                                                            onChange={(e) => handleSelectChange(index, 'confirm_payment_method', e.target.value)}
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
                                                            onChange={(e) => handleSelectChange(index, 'confirm_payment_bank', e.target.value)}
                                                            className="border rounded-md px-1 py-1 text-sm"
                                                        >
                                                            <option value="">선택</option>
                                                            <option value="shinhan">신한은행</option>
                                                            <option value="nh">농협은행</option>
                                                            <option value="kb">국민은행</option>
                                                            <option value="hana">하나은행</option>
                                                        </select>
                                                    </td>

                                                    <td className="p-2 border">
                                                        <input
                                                            type="text"
                                                            value={account.confirm_payment_desc}
                                                            onChange={(e) => handleSelectChange(index, 'confirm_payment_desc', e.target.value)}
                                                            className="w-full border rounded-md px-2 py-1 text-sm text-center"
                                                            placeholder="설명 입력"
                                                        />
                                                    </td>

                                                </tr>
                                            ))}
                                        </>
                                    ) : (
                                        <tr className="text-center text-sm">
                                            <td colSpan={8} className="py-4 border text-gray-500">디바이스 정보 없음
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-t border-gray-400 py-2 mx-4">
                    {/* ✅ 저장 버튼 (선택한 데이터만 API 호출) */}
                    <button
                        onClick={handleSave}
                        className="mb-4 mx-4 float-right px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PaymentStatus;
