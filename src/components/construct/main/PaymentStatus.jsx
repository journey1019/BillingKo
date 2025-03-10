/** PaymentStatus.jsx */
import { fetchKOMonthlyAccountSaveIndexData, fetchPaymentConfirm } from '@/service/monthlyAccountService.js';
import useApiFetch from '@/hooks/useApiFetch.js';
import useYearMonth from '@/hooks/useYearMonth.js';
import MonthPicker from '@/components/time/MonthPicker.jsx';
import { useState, useEffect,useMemo } from 'react';
import Popover from '@/components/layout/Popover.jsx';
import { formatNumber } from '@/utils/formatHelpers.jsx';
import { FaExchangeAlt } from "react-icons/fa";
import { showConfirmAlert, showSuccessAlert, showErrorAlert, showWarningAlert } from "@/utils/AlertService.js";



const PaymentStatus = ({ selectedDate, handleDateChange, yearMonth, monthlyAcctSaveData, loading, error }) => {
    // const { selectedDate, handleDateChange, yearMonth } = useYearMonth();
    // const { data: monthlyAcctSaveData = [], loading, error } = useApiFetch(fetchKOMonthlyAccountSaveIndexData, yearMonth);

    // ✅ 선택된 Row 데이터만 저장하는 상태
    const [confirmDatas, setConfirmDatas] = useState([]);

    // ✅ Row 클릭 이벤트 핸들러 (선택/해제 로직 개선)
    const handleRowClick = (account) => {
        setConfirmDatas(prevData => {
            const isSelected = prevData.some(item => item.acct_num === account.acct_num);
            if (isSelected) {
                // ✅ 기존 선택된 항목 제거
                return prevData.filter(item => item.acct_num !== account.acct_num);
            } else {
                // ✅ 최신 paymentData에서 해당 항목을 찾아 추가
                const updatedItem = monthlyAcctSaveData.find(item => item.acct_num === account.acct_num);
                return updatedItem ? [...prevData, updatedItem] : prevData;
            }
        });
    };

    // ✅ 개별 체크박스 변경 핸들러
    const handleCheckboxChange = (index) => {
        // ✅ confirmDatas도 업데이트
        setConfirmDatas(prevData =>
            prevData.map((item, i) =>
                i === index ? { ...item, confirm_yn: !item.confirm_yn } : item
            )
        );
    };

    // ✅ Select 및 Input 변경 핸들러
    const handleSelectChange = (index, field, value) => {
        setConfirmDatas(prevData =>
            prevData.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        );
    };

    // ✅ 선택된 데이터만 필터링하여 POST 요청
    const handleSave = async () => {
        if (!confirmDatas.length) {
            showWarningAlert("선택된 데이터 없음", "저장할 데이터를 선택해주세요!");
            return;
        }

        // ✅ 저장 확인 알람 재사용
        const isConfirmed = await showConfirmAlert("저장 확인", "선택된 데이터를 저장하시겠습니까?");
        if (!isConfirmed) return; // 사용자가 취소한 경우 종료

        const modifiedData = confirmDatas.map(account => ({
            acct_num: account.acct_num,
            confirm_yn: account.confirm_yn ? "Y" : "N",
            confirm_payment_method: account.confirm_payment_method || "",
            confirm_payment_bank: account.confirm_payment_bank || "",
            confirm_payment_desc: account.confirm_payment_desc || "",
        }));

        console.log("yearMonth:", yearMonth);
        console.log("modifiedData:", modifiedData);

        try {
            const response = await fetchPaymentConfirm(yearMonth, modifiedData);
            console.log("✅ API 응답:", response);
            showSuccessAlert("저장 성공", "납부 정보가 성공적으로 저장되었습니다!");
        } catch (error) {
            console.error("❌ 납부 정보 저장 실패:", error);
            showErrorAlert("저장 실패", "납부 정보 저장 중 오류가 발생했습니다.");
        }
    };


    // ✅ confirm_yn === "N" 인 항목만 전체 선택
    const handleSelectUnconfirmedRows = () => {
        const unconfirmedRows = monthlyAcctSaveData.filter(account => account.confirm_yn === "N");

        if (isAllUnconfirmedSelected) {
            // ✅ 이미 전체 선택된 경우 → 제거
            setConfirmDatas(prevData =>
                prevData.filter(account => account.confirm_yn !== "N")
            );
        } else {
            // ✅ 선택되지 않은 `confirm_yn === "N"` 항목 추가
            setConfirmDatas(prevData => {
                const newSelection = unconfirmedRows.filter(account =>
                    !prevData.some(selected => selected.acct_num === account.acct_num)
                );
                return [...prevData, ...newSelection];
            });
        }
    };


    // ✅ `isAllUnconfirmedSelected`를 useMemo로 계산
    const isAllUnconfirmedSelected = useMemo(() => {
        if (!monthlyAcctSaveData?.length) return false;

        const unconfirmedRows = monthlyAcctSaveData.filter(account => account.confirm_yn === "N");
        return unconfirmedRows.every(account =>
            confirmDatas.some(selected => selected.acct_num === account.acct_num)
        );
    }, [confirmDatas, monthlyAcctSaveData]);


    console.log(confirmDatas)

    const NotData = () => {
        return (
            <table className="w-full text-sm text-center border-collapse">
                <thead className="bg-gray-200 sticky -top-0.5" style={{zIndex: 1}}>
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
        )
    }

    return (
        <div className="flex flex-col py-4">
            <div className="bg-white rounded-2xl shadow-md">
                <div className="flex flex-row justify-between bg-neutral-200 rounded-t-2xl items-center px-4 py-2">
                    <h1 className="text-lg font-semibold">납부 현황</h1>
                    <div className="relative z-10">
                        <MonthPicker value={selectedDate} onDateChange={handleDateChange} />
                    </div>
                </div>

                <div className="px-4 pt-4">
                    <span className="text-red-500">납부현황을 체크할 데이터를 클릭해주세요.</span>
                </div>

                <div className="p-4 items-center text-center">
                    <div className="grid grid-cols-11">
                        {monthlyAcctSaveData?.length > 0 ? (
                            <div
                                className={`max-h-64 overflow-y-auto border border-gray-300 rounded-md ${confirmDatas?.length > 0 ? 'col-span-5' : 'col-span-11'}`}
                            >
                                <table className="w-full text-sm text-center border-collapse">
                                    <thead className="bg-gray-200 sticky -top-0.5" style={{ zIndex: 1 }}>
                                    <tr>
                                        {['번호', '고객 번호', '고객 이름', '미납 금액', '납부 확인', '납부 방법', '납부 은행', '납부 설명'].map((header, index) => (
                                            <th key={index} className="p-2 border font-medium whitespace-nowrap">
                                                {header}
                                            </th>
                                            /* Y(이미 Y된 항목 제외) N인 항목 전체 선택 */
                                            // <th key={index} className="px-2 py-1 border font-medium whitespace-nowrap">
                                            //     {header === '납부 확인' ? (
                                            //         <div className="flex justify-center items-center">
                                            //             <input
                                            //                 type="checkbox"
                                            //                 checked={isAllSelected}
                                            //                 onChange={handleSelectAll}
                                            //                 className="cursor-pointer"
                                            //                 indeterminate={isPartialSelected ? 'true' : undefined} // 일부 선택 시 중간 상태
                                            //             />
                                            //         </div>
                                            //     ) : (
                                            //         header
                                            //     )}
                                            // </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {monthlyAcctSaveData.map((account, index) => (
                                        <tr
                                            key={index}
                                            className={`cursor-pointer whitespace-nowrap ${confirmDatas.some(item => item.acct_num === account.acct_num) ? 'bg-gray-100' : ''}`}
                                            onClick={() => handleRowClick(account)}
                                        >
                                            <td className="p-2 border">{index + 1}</td>
                                            <td className="p-2 border">{account.acct_num}</td>
                                            <td className="p-2 border">{account.account_info.acct_name}</td>
                                            <Popover data={account}>
                                                <div className="float-right">
                                                    {formatNumber(account.none_pay_fee)}원
                                                </div>
                                            </Popover>
                                            {/*<td className="p-2 border">*/}
                                            {/*    <input*/}
                                            {/*        type="checkbox"*/}
                                            {/*        checked={confirmDatas.some(item => item.acct_num === account.acct_num)}*/}
                                            {/*        readOnly*/}
                                            {/*    />*/}
                                            {/*</td>*/}
                                            <td className="p-2 border">{account.confirm_yn}</td>
                                            <td className="p-2 border">{account.confirm_payment_method}</td>
                                            <td className="p-2 border">{account.confirm_payment_bank}</td>
                                            <td className="p-2 border">{account.confirm_payment_desc}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-md col-span-11">
                                <NotData/>
                            </div>
                        )}

                        {/* Y(이미 Y된 항목 제외) N인 항목 전체 선택 */}
                        {/* ✅ 두 번째 블록 (1 비율, 중앙 아이콘) → `selectedRows` 없을 때 숨김 */}
                        {confirmDatas?.length > 0 && (
                            <div className="col-span-1 flex flex-col justify-center items-center space-y-2">
                                {/* ✅ 원하는 아이콘 */}
                                <button
                                    onClick={handleSelectUnconfirmedRows}
                                    className={`px-2 py-1 bg-gray-300 text-black text-sm rounded-md hover:bg-gray-400 ${isAllUnconfirmedSelected ? 'bg-gray-500' : 'bg-gray-300'}`}
                                >
                                    <span className={`text-2xl `}><FaExchangeAlt /></span>
                                </button>

                                {/* ✅ 조건부 전체 선택/해제 버튼 */}
                                {/*<button*/}
                                {/*    onClick={handleSelectUnconfirmedRows}*/}
                                {/*    className="px-2 py-1 bg-gray-300 text-black text-sm rounded-md hover:bg-gray-400"*/}
                                {/*>*/}
                                {/*    미확인 {isAllUnconfirmedSelected ? "해제" : "전체 선택"}*/}
                                {/*</button>*/}
                            </div>
                        )}


                        {/* ✅ 세 번째 블록 (4.5 비율) → `selectedRows` 없을 때 숨김 */}
                        {confirmDatas?.length > 0 && (
                            <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-md col-span-5">
                                <table className="w-full text-sm text-center border-collapse">
                                    <thead className="bg-gray-200 sticky -top-0.5" style={{zIndex: 1}}>
                                    <tr>
                                        {['고객 번호', '고객 이름', '납부 금액', '납부 확인', '납부 방법', '납부 은행', '납부 설명', '선택 항목'].map((header, index) => (
                                            <th key={index} className="p-2 border font-medium whitespace-nowrap">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {confirmDatas.map((account, index) => (
                                        <tr
                                            key={index}
                                            className={`text-center text-sm cursor-pointer whitespace-nowrap`}
                                        >
                                            {/*<td className="p-2 border">{index + 1}</td>*/}
                                            <td className="p-2 border">{account.acct_num}</td>
                                            <td className="p-2 border">{account.account_info.acct_name}</td>
                                            <td className="p-2 border">
                                                <div className="float-right">
                                                    {formatNumber(account.final_fee)}원
                                                </div>
                                            </td>

                                            <td className="p-2 border">
                                                <input
                                                    type="checkbox"
                                                    checked={account.confirm_yn}
                                                    onChange={() => handleCheckboxChange(index)}
                                                    className="cursor-pointer"
                                                />
                                            </td>

                                            <td className="p-2 border">
                                                <select
                                                    value={account.confirm_payment_method || ""}
                                                    onChange={(e) => handleSelectChange(index, 'confirm_payment_method', e.target.value)}
                                                    className="border rounded-md px-1 py-1 text-sm"
                                                >
                                                    <option value="">선택</option>
                                                    <option value="account">계좌이체</option>
                                                    <option value="giro">지로</option>
                                                    <option value="card">카드</option>
                                                </select>
                                            </td>

                                            <td className="p-2 border">
                                                <select
                                                    value={account.confirm_payment_bank || ""}
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
                                            <td className="p-2 border">
                                                <button
                                                    className="text-red-500"
                                                    onClick={() => handleRowClick(account)}
                                                >
                                                    ❌
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
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
