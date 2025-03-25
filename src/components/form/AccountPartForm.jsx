import React from 'react';
import Accordion from '../ui/Accordions/Accordion.jsx';

const AccountPartForm = ({ accountPartData }) => {
    if (!accountPartData) return;

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

            {/* ✅ 기본 정보 */}
            {/*<h2 className="text-md font-semibold text-gray-800 border-b pb-1">기본 정보</h2>*/}
            {/*<div className="grid grid-cols-1 2xl:grid-cols-2 gap-2">*/}
            {/*    {[*/}
            {/*        { label: "고객 번호", value: accountPartData.acct_num },*/}
            {/*        { label: "고객 구분", value: accountPartData.account_type },*/}
            {/*        { label: "고객명", value: accountPartData.acct_name },*/}
            {/*        { label: "분류", value: accountPartData.classification },*/}
            {/*        { label: "등록 번호", value: accountPartData.acct_resident_num },*/}
            {/*        { label: "부가세율 (%)", value: accountPartData.tax_percent },*/}
            {/*    ].map(({ label, value }, index) => (*/}
            {/*        <div key={index} className="flex justify-between">*/}
            {/*            <label className="text-xs font-medium text-gray-500 w-1/6">{label}</label>*/}
            {/*            <span className="text-sm w-5/6">{formatDisplayValue(value)}</span>*/}
            {/*        </div>*/}
            {/*    ))}*/}
            {/*</div>*/}

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
            <div className="pb-4 border-b">
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
        </div>
    );
};

export default AccountPartForm;
