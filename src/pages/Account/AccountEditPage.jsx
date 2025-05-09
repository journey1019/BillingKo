import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useAccountStore from '@/stores/accountStore';
import { useAcctTypeList, useAcctClassificationOptions, useAcctResidentNumOptions, useAcctCompanyNameOptions } from '@/selectors/useAccountSelectors.js';
import { defaultAccountFormData } from '@/contents/accountFormDefault.js';
import LoadingSpinner from "@/components/common/LoadingSpinner.jsx";
import { formatPhoneNumber, formatBusinessNumber } from "@/utils/formatHelpers.jsx";
import { renderStandardInputField } from '@/utils/renderHelpers'

import { IoMdClose } from "react-icons/io";
import { Switch } from "@mui/material";


const AccountEditPage = () => {
    const { acct_num } = useParams();

    const acctTypeList = useAcctTypeList();
    const acctClassification = useAcctClassificationOptions();
    const acctResidentList = useAcctResidentNumOptions();
    const acctCompanyNameList = useAcctCompanyNameOptions();

    const navigate = useNavigate();
    const {
        accountPartData,
        accountPartLoading,
        accountPartError,
        fetchAccountDetails,
        updateAccountData
    } = useAccountStore();

    const [formData, setFormData] = useState(defaultAccountFormData);

    useEffect(() => {
        fetchAccountDetails(acct_num);
    }, [acct_num]);
    const normalizeNullToEmptyString = (obj) =>
        Object.fromEntries(
            Object.entries(obj).map(([key, value]) =>
                key === "regist_date" ? [] : [key, value ?? ""]
            )
        );


    // ✅ 데이터 불러오기
    useEffect(() => {
        if (accountPartData) {
            const formatted = {
                ...accountPartData,
                // regist_date: formatFormDate(accountPartData.regist_date),
                company_tel: formatPhoneNumber(accountPartData.company_tel),
                director_tel: formatPhoneNumber(accountPartData.director_tel),
                business_num: formatBusinessNumber(accountPartData.business_num),
            };
            setFormData(normalizeNullToEmptyString(formatted));
        }
    }, [accountPartData]);



    // ✅ 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        let formatted = value;

        if (name === "company_tel" || name === "director_tel") {
            formatted = formatPhoneNumber(value);
        } else if (name === "business_num") {
            formatted = formatBusinessNumber(value);
        }

        setFormData((prev) => ({ ...prev, [name]: formatted }));
    };

    // ✅ Yes / No 토글
    const handleToggleChange = () => {
        setFormData((prev) => ({ ...prev, use_yn: prev.use_yn === 'Y' ? 'N' : 'Y' }));
    };

    // ✅ 수정 요청
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // formData를 얕은 복사한 뒤, regist_date를 삭제
            const payload = { ...formData };
            delete payload.regist_date;

            await updateAccountData(acct_num, payload);
            alert('계정이 성공적으로 수정되었습니다.');
            navigate('/accounts');
        } catch (err) {
            alert(err.message || '수정에 실패했습니다.');
        }
    };

    if (accountPartLoading) return <LoadingSpinner />;
    if (accountPartError) return <p className="text-red-500">{accountPartError}</p>;

    // 주소 검색 함수를 재사용 가능하게 두 개로 분리
    const handleAddressSearch = (fieldPrefix) => {
        new window.daum.Postcode({
            oncomplete: function (data) {
                const fullAddress = data.address;
                const zonecode = data.zonecode;

                setFormData((prev) => ({
                    ...prev,
                    [`${fieldPrefix}_postcode`]: zonecode,
                    [`${fieldPrefix}_address`]: fullAddress,
                    [`${fieldPrefix}_address2`]: "", // 상세주소는 사용자가 입력
                }));
            }
        }).open();
    };
    // 버튼 클릭 시 company → invoice 복사
    const copyCompanyToInvoice = () => {
        setFormData((prev) => ({
            ...prev,
            invoice_postcode: prev.company_postcode,
            invoice_address: prev.company_address,
            invoice_address2: prev.company_address2,
        }));
    };

    return (
        <div className="container mx-auto">
            {/* ✅ 상단 영역 */}
            <div className="flex flex-row justify-between mb-3">
                <h1 className="py-1 text-lg font-bold">기존 계정 데이터 수정</h1>
                <button onClick={() => navigate("/accounts")} className="p-2 text-xl text-gray-600 hover:text-gray-900 transition">
                    <IoMdClose />
                </button>
            </div>

            {/* ✅ 입력 폼 */}
            <form className="bg-white p-5 rounded-xl space-y-4" onSubmit={handleSubmit}>
                {[
                    { id: 'acct_num', label: '고객번호', type: 'text', required: true, readOnly: true },
                    { id: 'account_type', label: '고객구분', type: 'text', placeholder: '예: 법인, 개인, 내부 등', dataList: acctTypeList, required: true },
                    { id: 'acct_name', label: '고객명', type: 'text', placeholder: '코리아오브컴', required: true },
                    { id: 'classification', label: '분류', type: 'text', placeholder: '홍수통제소',  dataList: acctClassification, required: true },
                    { id: 'acct_resident_num', label: '등록 번호', type: 'number', placeholder: '0',  dataList: acctResidentList, required: true },
                    { id: 'tax_percent', label: '부가 세율(%)', type: 'number', min: 0, max: 100, step: 0.1, placeholder: '1.0', required: true },
                    { id: 'company_name', label: '회사명', type: 'text', placeholder: '코리아오브컴', dataList: acctCompanyNameList },
                    { id: 'business_num', label: '사업자 등록 번호', type: 'text', placeholder: '000-00-00000' },
                    { id: 'recognize_id', label: '법인(주민) 번호', type: 'text', placeholder: '000-0000' },
                    { id: 'company_tel', label: '회사 전화 번호', type: 'tel', pattern: '[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}', placeholder: '00-0000-0000' },
                    { id: 'company_team', label: '팀명', type: 'text', placeholder: '기술부' },
                    { id: 'company_director', label: '담당자', type: 'text', placeholder: '홍길동' },
                    { id: 'director_email', label: '담당자 이메일', type: 'email', placeholder: 'example@gmail.com' },
                    { id: 'director_tel', label: '담당 전화 번호', type: 'tel', placeholder: '000-0000-0000', pattern: '[0-9]{3}-[0-9]{3,4}-[0-9]{4}' }
                ].map(({ id, label, type, dataList, placeholder, required, readOnly }) =>
                    renderStandardInputField(
                        id,
                        label,
                        type,
                        formData[id],
                        handleChange,
                        dataList,
                        required,
                        readOnly || false,
                        "", // 에러 메시지 있으면 여기에
                        placeholder
                    )
                )}

                {/* ☑️ 회사 주소 검색 */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label className="col-start-1 text-sm font-medium text-gray-900">
                        회사 주소
                        <span className="text-red-500">*</span>
                    </label>
                    <div className="col-span-2 flex flex-col gap-2">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                name="company_postcode"
                                value={formData.company_postcode ?? ''}
                                onChange={handleChange}
                                placeholder="우편번호"
                                className="flex-1 bg-gray-50 border border-gray-300 text-sm rounded-lg p-2.5"
                            />
                            <button type="button" onClick={() => handleAddressSearch('company')} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
                                주소 검색
                            </button>
                        </div>
                        <input
                            type="text"
                            name="company_address"
                            value={formData.company_address ?? ''}
                            onChange={handleChange}
                            placeholder="주소"
                            className="w-full bg-gray-50 border border-gray-300 text-sm rounded-lg p-2.5"
                        />
                        <input
                            type="text"
                            name="company_address2"
                            value={formData.company_address2 ?? ''}
                            onChange={handleChange}
                            placeholder="상세 주소"
                            className="w-full bg-gray-50 border border-gray-300 text-sm rounded-lg p-2.5"
                        />
                    </div>
                </div>

                {/* ☑️ 청구지 주소 검색 */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label className="col-start-1 text-sm font-medium text-gray-900">
                        청구지 주소
                        <span className="text-red-500">*</span>
                    </label>
                    <div className="col-span-2 flex flex-col gap-2">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                name="invoice_postcode"
                                value={formData.invoice_postcode ?? ''}
                                onChange={handleChange}
                                placeholder="우편번호"
                                className="flex-1 bg-gray-50 border border-gray-300 text-sm rounded-lg p-2.5"
                            />
                            <button type="button" onClick={() => handleAddressSearch('invoice')} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
                                주소 검색
                            </button>
                            <button type="button" onClick={copyCompanyToInvoice} className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-md text-sm">
                                회사 주소 복사
                            </button>
                        </div>
                        <input
                            type="text"
                            name="invoice_address"
                            value={formData.invoice_address ?? ''}
                            onChange={handleChange}
                            placeholder="주소"
                            className="w-full bg-gray-50 border border-gray-300 text-sm rounded-lg p-2.5"
                        />
                        <input
                            type="text"
                            name="invoice_address2"
                            value={formData.invoice_address2 ?? ''}
                            onChange={handleChange}
                            placeholder="상세 주소"
                            className="w-full bg-gray-50 border border-gray-300 text-sm rounded-lg p-2.5"
                        />
                    </div>
                </div>

                {/* ✅ 사용 여부 (토글 스위치) */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label className="col-start-1  w-32 text-sm font-medium text-gray-900">사용 여부 *</label>
                    <div className="col-start-2">
                        <Switch checked={formData.use_yn === 'Y'} onChange={handleToggleChange} />
                        <span className="text-sm text-gray-700">{formData.use_yn === 'Y' ? 'Yes' : 'No'}</span>
                    </div>
                </div>

                {/* ✅ 버튼 */}
                <div className="flex space-x-4">
                    <button type="submit"
                            className="text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-sm px-5 py-2.5">
                        수정
                    </button>
                    <button type="button" onClick={() => navigate('/accounts')}
                            className="text-gray-700 bg-gray-300 hover:bg-gray-400 rounded-lg text-sm px-5 py-2.5">
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AccountEditPage;
