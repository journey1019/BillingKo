import React from 'react';
import Accordion from '../ui/Accordions/Accordion.jsx';
import useAdjustmentMappings from '@/hooks/useAdjustmentMappings.js';
import { formatDateIndex, formatNumber, formatValue } from '@/utils/formatHelpers.jsx';
import TableToggleSwitch from '@/components/common/TableToggleSwitch'

const AccountPartForm = ({ accountPartData, adjustDetailData }) => {
    if (!accountPartData || !adjustDetailData) return;

    const codeMappings = useAdjustmentMappings();

    console.log(accountPartData)
    console.log(adjustDetailData[0])
    console.log(adjustDetailData)
    // 사용 여부 (Toggle)
    const isEnabled = accountPartData.use_yn === 'Y';

    // 날짜 포맷 함수
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('ko-KR', options);
    };

    // 빈 값 처리 함수
    const formatDisplayValue = (value) => {
        return !value || value === "null" ? "-" : value;
    };

    return (
        <div className="space-y-4">
            {/* ✅ 사용 여부 (맨 위) */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <span className="text-sm font-semibold text-gray-600">사용 여부</span>
                <div className="flex items-center space-x-2">
                    <div
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            isEnabled ? 'bg-blue-500' : 'bg-gray-400'
                        }`}
                    >
                        <div
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                                isEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </div>
                    <span className="text-sm font-medium">{isEnabled ? 'Yes' : 'No'}</span>
                </div>
            </div>

            <div className="flex flex-row items-center py-2">
                <span className="text-xs text-gray-500 w-1/6">등록일자 </span>
                <h2 className="text-sm font-semibold text-gray-800 w-5/6">{formatDate(accountPartData.regist_date)}</h2>
            </div>

            {/* ✅ 최종 기본 정보 */}
            <h2 className="text-md font-semibold text-gray-800 border-b pb-1">기본 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                    { label: "고객 번호", value: accountPartData.acct_num },
                    { label: "고객 구분", value: accountPartData.account_type },
                    { label: "고객명", value: accountPartData.acct_name },
                    { label: "분류", value: accountPartData.classification },
                    { label: "등록 번호", value: accountPartData.acct_resident_num },
                    { label: "부가세율 (%)", value: accountPartData.tax_percent },
                ].map(({ label, value }, index) => (
                    <div key={index} className="flex justify-between items-center">
                        <label className="text-xs font-medium text-gray-500 w-1/6 md:w-1/3 p-1">{label}</label>
                        <span
                            className="text-sm w-5/6 md:w-2/3 px-2 py-1 rounded-md bg-gray-100">{formatDisplayValue(value)}</span>
                    </div>
                ))}
            </div>


            {/* ✅ 회사 정보 */}
            <h2 className="text-md font-semibold text-gray-800 border-b pb-1">회사 정보</h2>
            {/* ✅ 회사 주소 정보 */}
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        { label: '회사명', value: accountPartData.company_name },
                        { label: '사업자 등록 번호', value: accountPartData.business_num },
                        { label: '법인(주민) 번호', value: accountPartData.recognize_id },
                        { label: '회사 전화 번호', value: accountPartData.company_tel },
                        { label: '회사 우편 번호', value: accountPartData.company_postcode },
                    ].map(({ label, value }, index) => (
                        <div key={index} className="flex justify-between items-center">
                            <label className="text-xs font-medium text-gray-500 w-1/6 md:w-1/3 p-1">{label}</label>
                            <span
                                className="text-sm w-5/6 md:w-2/3 px-2 py-1 rounded-md bg-gray-100">{formatDisplayValue(value)}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="pb-4 border-b">
                <div className="grid grid-cols-1 gap-3">
                    {[
                        { label: '회사 주소', value: accountPartData.company_address },
                        { label: '추가 주소', value: accountPartData.company_address2 },
                    ].map(({ label, value }, index) => (
                        <div key={index} className="flex justify-between items-center">
                            <label className="text-xs font-medium text-gray-500 w-1/6 p-1">{label}</label>
                            <span
                                className="text-sm w-5/6 px-2 py-1 rounded-md bg-gray-100">{formatDisplayValue(value)}</span>
                        </div>
                    ))}
                </div>
            </div>
            {/* ✅ 담당자 정보 */}
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        { label: '팀명', value: accountPartData.company_team },
                        { label: '담당자', value: accountPartData.company_director },
                        { label: '담당자 이메일', value: accountPartData.director_email },
                        { label: '담당자 전화번호', value: accountPartData.director_tel },
                        { label: "우편번호", value: accountPartData.invoice_postcode },
                    ].map(({ label, value }, index) => (
                        <div key={index} className="flex justify-between items-center">
                            <label className="text-xs font-medium text-gray-500 w-1/6 md:w-1/3 p-1">{label}</label>
                            <span
                                className="text-sm w-5/6 md:w-2/3 px-2 py-1 rounded-md bg-gray-100">{formatDisplayValue(value)}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="pb-4">
                <div className="grid grid-cols-1 gap-3">
                    {[
                        { label: '청구지 주소', value: accountPartData.invoice_address },
                        { label: '추가 주소', value: accountPartData.invoice_address2 },
                    ].map(({ label, value }, index) => (
                        <div key={index} className="flex justify-between items-center">
                            <label className="text-xs font-medium text-gray-500 w-1/6 p-1">{label}</label>
                            <span
                                className="text-sm w-5/6 px-2 py-1 rounded-md bg-gray-100">{formatDisplayValue(value)}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ✅ 최종 조정 정보 */}
            <h2 className="text-md font-semibold text-gray-800 border-b pb-1">조정 정보</h2>
            {adjustDetailData?.length > 0 && adjustDetailData[0] ? (
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                            { label: '사용 여부', value: adjustDetailData[0].use_yn },
                            {
                                label: '조정 종류',
                                value: codeMappings.adjustment_category[adjustDetailData[0].adjustment_category]
                            },
                            {
                                label: '조정 타입',
                                value: codeMappings.adjustment_type[adjustDetailData[0].adjustment_type]
                            },
                            { label: '요금 적용 기준', value: codeMappings.mount_type[adjustDetailData[0].mount_type] },
                            {
                                label: '조정 적용 주기',
                                value: codeMappings.adjustment_cycle[adjustDetailData[0].adjustment_cycle]
                            },
                            { label: '조정 적용 날짜', value: formatDateIndex(adjustDetailData[0].date_index) },
                            { label: '요금 적용 금액', value: adjustDetailData[0].mount_value },
                            { label: '설명', value: adjustDetailData[0].description },
                        ].map(({ label, value }, index) => (
                            <div key={index} className="flex justify-between items-center">
                                <label className="text-xs font-medium text-gray-500 w-1/6 md:w-1/3 p-1">{label}</label>
                                <span
                                    className="text-sm w-5/6 md:w-2/3 px-2 py-1 rounded-md bg-gray-100">{formatDisplayValue(value)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (<div className="text-gray-500 text-sm"> No Data </div>)}


            <div className="flex flex-row justify-between items-center border-b border-gray-400 pb-2 mb-4">
                <h2 className="text-lg font-semibold col-span-3">조정 내역</h2>
            </div>

            {Array.isArray(adjustDetailData) && adjustDetailData.length > 0 ? (
                <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md">
                    <table className="w-full text-sm text-center border-separate border-spacing-0">
                        <thead className="bg-gray-200 sticky top-0 z-10">
                        <tr>
                            {[
                                '번호', '사용', '조정 분류', '조정 타입',
                                '요금 기준', '조정 주기', '적용 날짜', '설명', '부가세 포함 여부', '조정 금액'
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
                        {adjustDetailData.map((adj, index) => (
                            <tr
                                key={index}
                                className="text-center text-sm whitespace-nowrap bg-white"
                            >
                                <td className="px-4 py-1 2xl:p-2 border">{index + 1}</td>
                                <td className="px-4 py-1 2xl:p-2 border justify-center">{TableToggleSwitch(adj.use_yn)}</td>
                                {/*<td className="px-4 py-2 border">{codeMappings.adjustment_code[adj.adjustment_code] || formatValue(adj.adjustment_code)}</td>*/}
                                {/*<td className="px-4 py-2 border">{formatValue(adj.adjustment_code_value)}</td>*/}
                                <td className="px-4 py-2 border">{codeMappings.adjustment_category[adj.adjustment_category] || formatValue(adj.adjustment_category)}</td>
                                <td className="px-4 py-2 border">{codeMappings.adjustment_type[adj.adjustment_type] || formatValue(adj.adjustment_type)}</td>
                                <td className="px-4 py-2 border">{codeMappings.mount_type[adj.mount_type] || formatValue(adj.mount_type)}</td>
                                <td className="px-4 py-2 border">{codeMappings.adjustment_cycle[adj.adjustment_cycle] || formatValue(adj.adjustment_cycle)}</td>
                                <td className="px-4 py-2 border">{formatDateIndex(adj.date_index)}</td>
                                <td className="px-4 py-2 border text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <TableToggleSwitch value={adj.use_yn} />
                                        <span className="text-sm text-gray-800">
                                            {adj.adjustment_tax_free_yn === 'Y' ? '부가세 미포함' : '부가세 포함'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-2 border text-right">{formatNumber(adj.adjustment_fee)}</td>
                                <td className="px-4 py-2 border">{formatValue(adj.description)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="mt-2 text-gray-500 text-sm">조정 내역 없음</p>
            )}
        </div>
    );
};

export default AccountPartForm;
