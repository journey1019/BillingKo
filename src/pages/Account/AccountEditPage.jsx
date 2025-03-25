import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateAccount, fetchAccountPart } from "@/service/accountService.js";
import { IoMdClose } from "react-icons/io";
import LoadingSpinner from "@/components/common/LoadingSpinner.jsx";
import { formatPhoneNumber, formatBusinessNumber, formatFormDate } from "@/utils/formatHelpers.jsx";
import { Switch } from "@mui/material";
import useAccountStore from '@/stores/accountStore';
import { useAcctTypeList, useAcctClassificationOptions, useAcctResidentNumOptions } from '@/selectors/useAccountSelectors.js';
import { defaultAccountFormData, inputAccountFormData } from '@/contents/accountFormDefault.js';

const AccountEditPage = () => {
    const { acct_num } = useParams();
    const acctTypeList = useAcctTypeList();
    const acctClassification = useAcctClassificationOptions();
    const acctResidentList = useAcctResidentNumOptions();
    console.log(acctTypeList)
    console.log(acctClassification)
    console.log(acctResidentList)


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
            Object.entries(obj).map(([key, value]) => [key, value ?? ""])
        );

    // ✅ 데이터 불러오기
    useEffect(() => {
        if (accountPartData) {
            const formatted = {
                ...accountPartData,
                regist_date: formatFormDate(accountPartData.regist_date),
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
            await updateAccountData(acct_num, formData);
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



    console.log(formData)
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
            <form className="bg-white p-5 rounded-xl space-y-6" onSubmit={handleSubmit}>
                {/* ☑️ 고객 번호 */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="acct_num" className="col-start-1 text-sm font-medium text-gray-900">
                        고객 번호
                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="acct_num"
                        name="acct_num"
                        type="text"
                        value={formData.acct_num ?? ''} // null 방지
                        onChange={handleChange}
                        className="col-span-2 bg-gray-50 border border-gray-300 text-sm rounded-lg p-2.5"
                        readOnly={true}
                        required={true}
                    />
                </div>

                {/* ☑️ 고객 구분 */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="account_type" className="col-start-1 text-sm font-medium text-gray-900">
                        고객 구분
                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        list="account-type-options"
                        id="account_type"
                        name="account_type"
                        value={formData.account_type ?? ''}
                        onChange={handleChange}
                        placeholder="예: 법인, 개인, 내부 등"
                        className="col-span-2 bg-gray-50 border border-gray-300 text-sm rounded-lg p-2.5"
                    />
                    <datalist id="account-type-options">
                        {acctTypeList.map((type, index) => (
                            <option key={index} value={type} />
                        ))}
                    </datalist>
                </div>

                {/*{inputAccountFormData.map(({ id, label, type, required, ...rest }) => {*/}
                {/*    if (id === "company_postcode") {*/}
                {/*        return (*/}
                {/*            <div className="grid grid-cols-6 items-center space-x-4" key={id}>*/}
                {/*                <label htmlFor={id} className="col-start-1 text-sm font-medium text-gray-900">*/}
                {/*                    {label}{required && <span className="text-red-500">*</span>}*/}
                {/*                </label>*/}
                {/*                <div className="col-span-2 flex gap-2">*/}
                {/*                    <input*/}
                {/*                        id={id}*/}
                {/*                        name={id}*/}
                {/*                        type="text"*/}
                {/*                        value={formData[id] ?? ''}*/}
                {/*                        onChange={handleChange}*/}
                {/*                        className="flex-1 bg-gray-50 border border-gray-300 text-sm rounded-lg p-2.5"*/}
                {/*                        {...rest}*/}
                {/*                    />*/}
                {/*                    <button*/}
                {/*                        type="button"*/}
                {/*                        onClick={handleAddressSearch}*/}
                {/*                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"*/}
                {/*                    >*/}
                {/*                        주소 검색*/}
                {/*                    </button>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        );*/}
                {/*    }*/}

                {/*    return (*/}
                {/*        <div className="grid grid-cols-6 items-center space-x-4" key={id}>*/}
                {/*            <label htmlFor={id} className="col-start-1 text-sm font-medium text-gray-900">*/}
                {/*                {label}{required && <span className="text-red-500">*</span>}*/}
                {/*            </label>*/}
                {/*            <input*/}
                {/*                id={id}*/}
                {/*                name={id}*/}
                {/*                type={type === 'number' ? 'text' : type}*/}
                {/*                value={formData[id] ?? ''}*/}
                {/*                onChange={handleChange}*/}
                {/*                className="col-span-2 bg-gray-50 border border-gray-300 text-sm rounded-lg p-2.5"*/}
                {/*                {...rest}*/}
                {/*            />*/}
                {/*        </div>*/}
                {/*    );*/}
                {/*})}*/}

                {inputAccountFormData.map(({ id, label, type, required, ...rest }) => (
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor={id}
                               className="col-start-1 text-sm font-medium text-gray-900">{label}{required &&
                            <span className="text-red-500">*</span>}</label>
                        <input
                            id={id}
                            name={id}
                            type={type === 'number' ? 'text' : type}
                            value={formData[id] ?? ''} // null 방지
                            onChange={handleChange}
                            className="col-span-2 bg-gray-50 border border-gray-300 text-sm rounded-lg p-2.5"
                            {...rest}
                        />
                    </div>
                ))}

                {/* ☑️ 회사 주소 검색 */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label className="col-start-1 text-sm font-medium text-gray-900">회사 주소</label>
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
                    <label className="col-start-1 text-sm font-medium text-gray-900">청구지 주소</label>
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



                {/* 나머지 필드 */}
                {/*{inputAccountFormData.map(({ id, label, type, required, ...rest }) => (*/}
                {/*    <div className="grid grid-cols-6 items-center space-x-4">*/}
                {/*        <label htmlFor={id}*/}
                {/*               className="col-start-1 text-sm font-medium text-gray-900">{label}{required &&*/}
                {/*            <span className="text-red-500">*</span>}</label>*/}
                {/*        <input*/}
                {/*            id={id}*/}
                {/*            name={id}*/}
                {/*            type={type === 'number' ? 'text' : type}*/}
                {/*            value={formData[id] ?? ''} // null 방지*/}
                {/*            onChange={handleChange}*/}
                {/*            className="col-span-2 bg-gray-50 border border-gray-300 text-sm rounded-lg p-2.5"*/}
                {/*            {...rest}*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*))}*/}

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
