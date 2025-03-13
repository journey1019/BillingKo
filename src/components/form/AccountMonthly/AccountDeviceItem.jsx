import { formatDateIndex, formatNumber, formatValue } from '@/utils/formatHelpers.jsx';
import { MdEdit } from 'react-icons/md';
import Dropdown from '@/components/dropdown/Dropdown.jsx';
import { useNavigate } from "react-router-dom";
import AdjustDropdownForm from '@/components/form/AccountMonthly/Edit/AdjustDropdownForm.jsx';


const AccountDeviceItem = ({ yearMonth, accountData, deviceDetail, adjustmentInfo, nonePayInfo }) => {
    const navigate = useNavigate();

    console.log(accountData)
    console.log(deviceDetail)
    console.log(adjustmentInfo)
    console.log(nonePayInfo)

    return(
        <>
            <div className="col-span-3 flex flex-row justify-between items-center border-b border-gray-400 pb-2 mb-4">
                <h2 className="text-lg font-semibold col-span-3">디바이스 상세 정보</h2>
                {/*<FaPlus/>*/}
            </div>
            <div className="col-span-3">
                {deviceDetail.length > 0 ? (
                    <div className="max-h-52 overflow-y-auto border border-gray-300 rounded-md">
                        <table className="w-full text-sm 2xl:text-sm text-center border-collapse">
                            <thead className="bg-gray-200 sticky -top-0.5 z-10">
                            <tr>
                                {["번호", "별칭", "단말기", "사용 기간", "기본료", "통신료", "기타 사용료", "부가 서비스료", "사용 바이트 수 (b)", "총 요금"].map((header, index) => (
                                    <th key={index}
                                        className="px-2 py-1 2xl:p-2 border font-medium whitespace-nowrap">{header}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {deviceDetail
                                .sort((a, b) => b.period_data - a.period_data) // 기간 기준 내림차순 정렬
                                .map((device, index) => (
                                    <tr key={index}
                                        className="text-center text-xs 2xl:text-sm whitespace-nowrap bg-white">
                                        <td className="px-2 py-1 2xl:p-2 border">{index + 1}</td>
                                        <td className="px-2 py-1 2xl:p-2 border">{device.alias}</td>
                                        {/*<td className="px-2 py-1 2xl:p-2 border text-blue-500 cursor-pointer hover:underline">{device.serial_number}</td>*/}
                                        <td
                                            className="px-2 py-1 2xl:p-2 border text-blue-500 cursor-pointer hover:underline"
                                            onClick={() => navigate(`/ko_monthly?yearMonth=${yearMonth}&serial=${device.serial_number}`)}
                                        >
                                            {device.serial_number}
                                        </td>
                                        <td className="px-2 py-1 2xl:p-2 border">{device.period_data}</td>
                                        <td className="px-2 py-1 2xl:p-2 border">{formatNumber(device.basic_fee)}</td>
                                        <td className="px-2 py-1 2xl:p-2 border">{formatNumber(device.add_use_fee)}</td>
                                        <td className="px-2 py-1 2xl:p-2 border">{formatNumber(device.subscribe_fee)}</td>
                                        <td className="px-2 py-1 2xl:p-2 border">{formatNumber(device.modification_fee)}</td>
                                        <td className="px-2 py-1 2xl:p-2 border">{formatNumber(device.use_byte_total)}</td>
                                        <td className="px-2 py-1 2xl:p-2 border font-bold">{formatNumber(device.total_fee)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="mt-2 text-gray-500 text-sm">디바이스 정보 없음</p>
                )}
            </div>

            <div className="col-span-3 space-x-2 pt-6">
                <div>
                    <div className="flex flex-row justify-between items-center border-b border-gray-400 pb-2 mb-4">
                        <h2 className="text-lg font-semibold col-span-3">조정 내역</h2>
                        {/*<Dropdown trigger={<MdEdit />} position="right">*/}
                        {/*    /!* ✅ 드롭다운 내부 컨텐츠 (동적으로 변경 가능) *!/*/}
                        {/*    <div className="text-end space-x-2">*/}
                        {/*        <li className="p-2 hover:bg-gray-100 cursor-pointer">비휘발성 조정금액 추가</li>*/}
                        {/*        <li className="p-2 hover:bg-gray-100 cursor-pointer">휘발성 조정금액 추가</li>*/}
                        {/*    </div>*/}
                        {/*</Dropdown>*/}
                        <AdjustDropdownForm acctNum={accountData.acct_num} yearMonth={yearMonth}/>
                    </div>
                    <div className="col-span-3">
                        {Array.isArray(adjustmentInfo) && adjustmentInfo.length > 0 ? (
                            <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md">
                                <table className="w-full text-sm text-center">
                                    <thead className="bg-gray-200">
                                    <tr>
                                        {['번호', '조정 유형', '조정 대상', '조정 분류', '조정 타입', '요금 기준', '조정 금액', '설명'].map((header, index) => (
                                            <th key={index}
                                                className="px-2 py-1 2xl:p-2 border font-medium whitespace-nowrap">{header}</th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {adjustmentInfo.map((adj, index) => (
                                        <tr key={index}
                                            className="text-center text-xs 2xl:text-sm whitespace-nowrap bg-white">
                                            <td className="px-2 py-1 2xl:p-2 border">{index + 1}</td>
                                            <td className="p-2 border">{formatValue(adj.adjustment_code)}</td>
                                            <td className="p-2 border">{formatValue(adj.adjustment_value)}</td>
                                            <td className="p-2 border">{formatValue(adj.adjustment_category)}</td>
                                            <td className="p-2 border">{formatValue(adj.adjustment_type)}</td>
                                            <td className="p-2 border">{formatValue(adj.mount_type)}</td>
                                            <td className="p-2 border">{formatNumber(adj.adjustment_fee)} 원</td>
                                            <td className="p-2 border">{formatValue(adj.description)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="mt-2 text-gray-500 text-sm">조정 내역 없음</p>
                        )}
                    </div>
                </div>
            </div>
            <div className="col-span-3 space-x-2 pt-6 pb-2">
                <div>
                    <div className="flex flex-row justify-between items-center border-b border-gray-400 pb-2 mb-4">
                        <h2 className="text-lg font-semibold col-span-3">미납 내역</h2>
                    </div>
                    <div className="col-span-3">
                        {Array.isArray(nonePayInfo) && nonePayInfo.length > 0 ? (
                            <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md">
                                <table className="w-full text-sm text-center">
                                    <thead className="bg-gray-200">
                                    <tr>
                                        {['미납 날짜', '미납 기간', '적용 이자', '당월 미납 금액', '최종 미납 금액'].map((header, index) => (
                                            <th key={index}
                                                className="px-2 py-1 2xl:p-2 border font-medium whitespace-nowrap">{header}</th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {nonePayInfo.map((np, index) => (
                                        <tr key={index} className="text-center text-xs 2xl:text-sm whitespace-nowrap bg-white">
                                            <td className="p-2 border">{formatDateIndex(np.date_index)}</td>
                                            <td className="p-2 border">{np.none_paid_period} 개월</td>
                                            <td className="p-2 border">{np.add_percent}%</td>
                                            <td className="p-2 border">{formatNumber(np.monthly_final_fee)} 원</td>
                                            <td className="p-2 border">{formatNumber(np.none_paid_fee)} 원</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="mt-2 text-gray-500 text-sm">미납 내역 없음</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default AccountDeviceItem;