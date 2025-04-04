import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createAccount } from "@/service/accountService.js";
import { useAcctNumList, useAcctTypeList } from '@/selectors/useAccountSelectors.js';
import { defaultAccountFormData, inputAccountFormData } from '@/contents/accountFormDefault.js';
import { formatPhoneNumber } from '@/utils/formatPhoneNumber.jsx';
import { formatBusinessNumber } from '@/utils/formatBusinessNumber';
import useAccountStore from '@/stores/accountStore';
import { renderStandardInputField } from '@/utils/renderHelpers.jsx';

import { Switch } from "@mui/material";
import { IoMdClose } from "react-icons/io";


const AccountNewPage = () => {
    const { fetchAccountData } = useAccountStore();
    const navigate = useNavigate();

    // Select Field
    const acctNumList = useAcctNumList(); // acct_num 중복 검사
    const acctTypeList = useAcctTypeList(); // account_type (법인/개인)

    useEffect(() => {
        fetchAccountData(); // 초기 accountData 불러 오기 (중복 검사)
    }, []);

    // ✅ 폼 데이터 상태 관리
    const [formData, setFormData] = useState(defaultAccountFormData);

    const [error, setError] = useState(null);
    const [acctNumError, setAcctNumError] = useState("");

    // ✅ 입력 변경 핸들러 (중복 검사 포함)
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value || null });

        let formattedValue = value;

        // ✅ 사업자등록번호 자동 포맷
        if (id === "business_num") {
            formattedValue = formatBusinessNumber(value);
        }

        // ✅ 전화번호 필드 자동 포맷 적용
        if (id === "company_tel" || id === "director_tel") {
            formattedValue = formatPhoneNumber(value);
        }

        setFormData((prev) => ({ ...prev, [id]: formattedValue }));

        if (id === "acct_num") {
            if (acctNumList.includes(value)) {
                setAcctNumError("이미 존재하는 계정 번호입니다.");
            } else {
                setAcctNumError("");
            }
        }
    };

    // ✅ 토글 버튼 핸들러 (사용 유무)
    const handleToggleChange = (e) => {
        setFormData({ ...formData, use_yn: e.target.checked ? "Y" : "N" });
    };
    // ✅ 필수 필드 검증 함수
    const validateFormData = () => {
        const requiredFields = [
            "acct_num", // 고객번호
            "account_type", // 고객구분(* 아니지만 포함)
            "acct_name", // 고객명
            "classification", // 분류
            "acct_resident_num", // 분류
            "tax_percent", // 부가 세율(%)
            "use_yn", // 사용
        ];

        for (const field of requiredFields) {
            if (!formData[field]) {
                console.log(field)
                return `필수 입력 항목: ${field}`;
            }
        }

        return null;
    };

    // ✅ 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (acctNumList.includes(formData.acct_num)) {
            setAcctNumError("이미 존재하는 계정 번호입니다.");
            return;
        }

        const validationError = validateFormData();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            // 🔥 regist_date 키 제거
            const { regist_date, ...payload } = formData;
            await createAccount(payload);
            alert("계정이 성공적으로 생성되었습니다.");
            navigate("/accounts");
        } catch (err) {
            setError(err.response?.data?.detail || "계정 생성에 실패했습니다.");
        }
    };


    // 주소 검색 함수를 재사용 가능하게 두 개로 분리
    const handleAddressSearch = (fieldPrefix) => {
        new window.daum.Postcode({
            oncomplete: function(data) {
                const fullAddress = data.address;
                const zonecode = data.zonecode;

                setFormData((prev) => ({
                    ...prev,
                    [`${fieldPrefix}_postcode`]: zonecode,
                    [`${fieldPrefix}_address`]: fullAddress,
                    [`${fieldPrefix}_address2`]: '', // 상세주소는 사용자가 입력
                }));
            },
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

    const extendedFormData = [
        // { id: 'account_type', label: '고객 구분', type: 'text', placeholder: '법인', required: true },
        ...inputAccountFormData
    ];

    return (
        <div className="container mx-auto">
            {/* ✅ 상단 타이틀 및 닫기 버튼 */}
            <div className="flex flex-row justify-between mb-3">
                <h1 className="py-1 text-lg font-bold">신규 계정 등록</h1>
                <button onClick={() => navigate('/accounts')}
                        className="flex flex-row items-center p-2 text-xl text-gray-600 hover:text-gray-900 transition">
                    <IoMdClose />
                </button>
            </div>

            {/* ✅ 입력 폼 */}
            <form className="bg-white p-5 rounded-xl space-y-4" onSubmit={handleSubmit}>
                {/* ✅ 고객 번호 (중복 검사 포함) */}
                {[
                    { id: "acct_num", label: "고객번호", type: "text", placeholder: "KO_99999", error: acctNumError, required: true },
                    { id: "account_type", label: "고객구분", type: "text", dataList: acctTypeList, required: true, placeholder: "예: 법인, 개인" },
                    ...extendedFormData
                ].map(({ id, label, type, dataList, placeholder, required, errorMessage }) =>
                    renderStandardInputField(
                        id,
                        label,
                        type,
                        formData[id],
                        handleInputChange,
                        dataList,
                        required,
                        errorMessage,
                        id === "acct_num" ? acctNumError : "", // ✅ 조건부 에러 메시지 전달
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
                                id="company_postcode"
                                type="text"
                                name="company_postcode"
                                value={formData.company_postcode ?? ''}
                                onChange={handleInputChange}
                                placeholder="우편번호"
                                className="flex-1 bg-gray-50 border border-gray-300 text-sm rounded-lg p-2.5"
                            />
                            <button type="button" onClick={() => handleAddressSearch('company')} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
                                주소 검색
                            </button>
                        </div>
                        <input
                            id="company_address"
                            type="text"
                            name="company_address"
                            value={formData.company_address ?? ''}
                            onChange={handleInputChange}
                            placeholder="주소"
                            className="w-full bg-gray-50 border border-gray-300 text-sm rounded-lg p-2.5"
                        />
                        <input
                            id="company_address2"
                            type="text"
                            name="company_address2"
                            value={formData.company_address2 ?? ''}
                            onChange={handleInputChange}
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
                                id="invoice_postcode"
                                type="text"
                                name="invoice_postcode"
                                value={formData.invoice_postcode ?? ''}
                                onChange={handleInputChange}
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
                            id="invoice_address"
                            type="text"
                            name="invoice_address"
                            value={formData.invoice_address ?? ''}
                            onChange={handleInputChange}
                            placeholder="주소"
                            className="w-full bg-gray-50 border border-gray-300 text-sm rounded-lg p-2.5"
                        />
                        <input
                            id="invoice_address2"
                            type="text"
                            name="invoice_address2"
                            value={formData.invoice_address2 ?? ''}
                            onChange={handleInputChange}
                            placeholder="상세 주소"
                            className="w-full bg-gray-50 border border-gray-300 text-sm rounded-lg p-2.5"
                        />
                    </div>
                </div>


                {/* ✅ 사용 여부 (토글) */}
                <div className="grid grid-cols-6 flex items-center space-x-4">
                    <label className="col-start-1 w-32 text-sm font-medium text-gray-900">사용 여부 *</label>
                    <div className="col-start-2 items-center">
                        <Switch checked={formData.use_yn === "Y"} onChange={handleToggleChange} />
                        <span className="text-sm text-gray-700">{formData.use_yn === "Y" ? "Yes" : "No"}</span>
                    </div>
                </div>

                {/* ✅ 저장 버튼 */}
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg">
                    저장
                </button>

                {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
            </form>
        </div>

    );
};

export default AccountNewPage;