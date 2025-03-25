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
                {/* 고객 번호 */}
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

                {/* 고객 구분 */}
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

                {/* 나머지 필드 */}
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
