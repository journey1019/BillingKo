import React, { useState, useEffect } from "react";
import { formatDateIndex, formatNumber, formatValue } from '@/utils/formatHelpers.jsx';
import { MdEdit } from 'react-icons/md';
import Dropdown from '@/components/dropdown/Dropdown.jsx';
import { useNavigate } from "react-router-dom";
import AdjustDropdownForm from '@/components/form/AccountMonthly/Edit/AdjustDropdownForm.jsx';
import { fetchAdjustmentCodeName } from '@/service/adjustmentService.js';
import useAdjustmentMappings from '@/hooks/useAdjustmentMappings.js';
import { LuRefreshCw } from "react-icons/lu";
import ReadOnlySwitch from '@/components/ui/switches/ReadOnlySwitch.jsx';


/**
 * @desc: 고객별 청구서 수정 페이지_Account Right Form
 * */
const AccountDeviceItem = ({ yearMonth, accountData, deviceDetail, adjustmentInfo, nonePayInfo, onAdjustmentRefresh }) => {
    const navigate = useNavigate();
    const codeMappings = useAdjustmentMappings();

    console.log('yearMonth', yearMonth)
    console.log(accountData)
    console.log(deviceDetail)
    console.log(adjustmentInfo)
    console.log(nonePayInfo)
    console.log('codeMappings: ', codeMappings);

    return(
        <>
            <div className="col-span-3 flex flex-row justify-between items-center border-b border-gray-400 pb-2 mb-4">
                <h2 className="text-lg font-semibold col-span-3">디바이스 상세 정보</h2>
                {/*<FaPlus/>*/}
            </div>
            <div className="col-span-3">
                {deviceDetail.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md">
                        <table className="w-full text-sm text-center border-collapse">
                            <thead className="bg-gray-200 sticky -top-0.5 z-10">
                            <tr>
                                {["번호", "별칭", "단말기", "사용 기간", "기본료", "통신료", "기타 사용료", "부가 서비스료", "사용 바이트 수 (b)", "총 요금"].map((header, index) => (
                                    <th key={index}
                                        className="px-4 py-1 2xl:py-2 border font-medium whitespace-nowrap">{header}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {deviceDetail
                                .sort((a, b) => b.period_data - a.period_data) // 기간 기준 내림차순 정렬
                                .map((device, index) => (
                                    <tr key={index}
                                        className="text-center text-sm 2xl:text-sm whitespace-nowrap bg-white">
                                        <td className="px-4 py-1 2xl:py-2 border">{index + 1}</td>
                                        <td className="px-4 py-1 2xl:py-2 border">{device.alias}</td>
                                        {/*<td className="px-4 py-1 2xl:py-2 border text-blue-500 cursor-pointer hover:underline">{device.serial_number}</td>*/}
                                        <td
                                            className="px-4 py-1 2xl:py-2 border text-blue-500 cursor-pointer hover:underline"
                                            onClick={() => navigate(`/ko_monthly?yearMonth=${yearMonth}&serial=${device.serial_number}`)}
                                        >
                                            {device.serial_number}
                                        </td>
                                        <td className="px-4 py-1 2xl:py-2 border">{device.period_data}</td>
                                        <td className="px-4 py-1 2xl:py-2 border text-right">{formatNumber(device.basic_fee)}</td>
                                        <td className="p-2 border text-right">{formatNumber(device.add_use_fee)}</td>
                                        <td className="px-4 py-1 2xl:py-2 border text-right">{formatNumber(device.subscribe_fee)}</td>
                                        <td className="px-4 py-1 2xl:py-2 border text-right">{formatNumber(device.modification_fee)}</td>
                                        <td className="px-4 py-1 2xl:py-2 border text-right">{formatNumber(device.use_byte_total)}</td>
                                        <td className="px-4 py-1 2xl:py-2 border font-bold text-right">{formatNumber(device.total_fee)}</td>
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
                        <div className="flex flex-row space-x-2">
                            <button
                                className="hover:text-blue-500"
                                onClick={() => { window.location.href = `/ko_monthly_account?yearMonth=${yearMonth}&acctNum=${accountData.acct_num}` }}
                            >
                                <LuRefreshCw />
                            </button>
                            {/*<button*/}
                            {/*    className="hover:text-blue-500"*/}
                            {/*    onClick={onAdjustmentRefresh}*/}
                            {/*>*/}
                            {/*    <LuRefreshCw />*/}
                            {/*</button>*/}
                            <AdjustDropdownForm adjustmentCode="account_num" adjustmentCodeValue={accountData.acct_num} yearMonth={yearMonth} taxFreeYn="Y"/>
                        </div>
                    </div>

                    {Array.isArray(adjustmentInfo) && adjustmentInfo.length > 0 ? (
                        <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md">
                            <table className="w-full text-sm text-center border-separate border-spacing-0">
                                <thead className="bg-gray-200 sticky top-0 z-10">
                                <tr>
                                    {[
                                        '번호', '조정 유형', '조정 대상', '조정 분류', '조정 타입',
                                        '요금 기준', '설명', '부가세 포함 여부', '조정 금액',
                                    ].map((header, index) => (
                                        <th
                                            key={index}
                                            className="px-4 py-1 2xl:py-2 border font-medium whitespace-nowrap bg-gray-200"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {[...adjustmentInfo]  // 배열을 복사해서 원본을 건드리지 않음
                                    .slice()            // 복사 안전하게
                                    .reverse()          // 배열 순서를 뒤집음
                                    .map((adj, index) => (
                                        <tr
                                            key={index}
                                            className="text-center text-sm whitespace-nowrap bg-white"
                                        >
                                            <td className="px-4 py-1 2xl:p-2 border">{index + 1}</td>
                                            <td className="px-4 py-2 border">{codeMappings.adjustment_code[adj.adjustment_code] || formatValue(adj.adjustment_code)}</td>
                                            <td className="px-4 py-2 border">{formatValue(adj.adjustment_value)}</td>
                                            <td className="px-4 py-2 border">{codeMappings.adjustment_category[adj.adjustment_category] || formatValue(adj.adjustment_category)}</td>
                                            <td className="px-4 py-2 border">{codeMappings.adjustment_type[adj.adjustment_type] || formatValue(adj.adjustment_type)}</td>
                                            <td className="px-4 py-2 border">{codeMappings.mount_type[adj.mount_type] || formatValue(adj.mount_type)}</td>
                                            <td className="px-4 py-2 border">{formatValue(adj.description)}</td>
                                            <div className="px-4 py-2 border">
                                                <ReadOnlySwitch isEnabled={adj.adjustment_tax_free_yn} labelOn="부가세 포함" labelOff="부가세 미포함" />
                                            </div>
                                            {/*<td className="px-4 py-2 border">{formatValue(adj.adjustment_tax_free_yn === 'Y' ? '부가세 미포함' : '부가세 포함')}</td>*/}
                                            <td className="px-4 py-2 border text-right">{formatNumber(adj.adjustment_fee)}</td>
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
                                        {['번호', '미납 날짜', '미납 기간', '적용 이자', '당월 미납 금액', '최종 미납 금액'].map((header, index) => (
                                            <th key={index}
                                                className="px-4 py-1 2xl:py-2 border font-medium whitespace-nowrap">{header}</th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {nonePayInfo.map((np, index) => (
                                        <tr key={index} className="text-center text-sm whitespace-nowrap bg-white">
                                            <td className="px-4 py-1 2xl:p-2 border">{index + 1}</td>
                                            <td className="px-4 py-2 border">{formatDateIndex(np.date_index)}</td>
                                            <td className="px-4 py-2 border">{np.none_paid_period} 개월</td>
                                            <td className="px-4 py-2 border">{np.add_percent}%</td>
                                            <td className="px-4 py-2 border text-right">{formatNumber(np.monthly_final_fee)}</td>
                                            <td className="px-4 py-2 border text-right">{formatNumber(np.none_paid_fee)}</td>
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