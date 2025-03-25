import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createAccount } from "@/service/accountService.js";
import { IoMdClose } from "react-icons/io";
import { Switch } from "@mui/material";
import { formatPhoneNumber } from '@/utils/formatPhoneNumber.jsx';
import useAccountStore from '@/stores/accountStore';
import { useAcctNumList } from '@/selectors/useAccountSelectors.js';
import { defaultAccountFormData } from '@/contents/accountFormDefault.js';
import { inputAccountFormData } from '../../contents/accountFormDefault.js';

const AccountNewPage = () => {
    const { accountData, fetchAccountData, isDuplicateAcctNm, accountLoading, accountError } = useAccountStore();
    const acctNumList = useAcctNumList();

    const navigate = useNavigate();

    useEffect(() => {
        fetchAccountData(); // 초기 accountData 불러오기
    }, []);


    // ✅ 폼 데이터 상태 관리
    const [formData, setFormData] = useState(defaultAccountFormData);

    const [error, setError] = useState(null);
    const [acctNumError, setAcctNumError] = useState("");

    // ✅ 입력 변경 핸들러 (중복 검사 포함)
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value || null });

        if (id === "acct_num") {
            if (acctNumList.includes(value)) {
                setAcctNumError("이미 존재하는 계정 번호입니다.");
            } else {
                setAcctNumError("");
            }
        }

        let formattedValue = value;

        // ✅ 전화번호 필드 자동 포맷 적용
        if (id === "company_tel" || id === "director_tel") {
            formattedValue = formatPhoneNumber(value);
        }

        setFormData((prev) => ({ ...prev, [id]: formattedValue }));
    };

    // ✅ 토글 버튼 핸들러 (사용 유무)
    const handleToggleChange = (e) => {
        setFormData({ ...formData, use_yn: e.target.checked ? "Y" : "N" });
    };

    // ✅ 필수 필드 검증 함수
    const validateFormData = () => {
        const requiredFields = [
            "acct_num",
            "acct_name",
            "acct_resident_num",
            "classification",
            "use_yn",
        ];

        for (const field of requiredFields) {
            if (!formData[field]) {
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
            await createAccount(formData);
            alert("계정이 성공적으로 생성되었습니다.");
            navigate("/accounts");
        } catch (err) {
            setError(err.response?.data?.detail || "계정 생성에 실패했습니다.");
        }
    };

    const renderInputField = (id, label, type, required, errorMessage, placeholder, extraProps = {}) => (
        <div className="flex items-center space-x-4" key={id}>
            <label htmlFor={id} className="w-32 text-sm font-medium text-gray-900">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="flex-1">
                <input id={id} type={type} value={formData[id]} onChange={handleInputChange} placeholder={placeholder}
                       className={`w-full bg-gray-50 border ${errorMessage ? "border-red-500" : "border-gray-300"} text-gray-900 text-sm rounded-lg p-2.5`}
                       {...extraProps} required={required}/>
                {errorMessage && <p className="text-red-500 text-xs mt-1">{errorMessage}</p>}
            </div>
        </div>
    );
    const renderSelectFiled = (id, label, type, required, list) => (
        <div className="flex items-center space-x-4">
            <label className="w-32 text-sm font-medium text-gray-900">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <select
                id="acct_num"
                value={formData.id}
                onChange={handleInputChange}
                className="flex-1 w-full border border-gray-300 rounded-lg p-2 text-sm"
            >
                <option value="">선택</option>
                {list?.map((num) => (
                    <option key={num} value={num}>{num}</option>
                ))}
            </select>
        </div>
    )


    const extendedFormData = [
        { id: 'account_type', label: '고객 구분', type: 'text', placeholder: '법인', required: true },
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
                {renderInputField("acct_num", "고객번호", "text", true, acctNumError, "KO_99999")}

                {/* ✅ account_type 포함된 전체 필드 */}
                {extendedFormData.map((
                    { id, label, type, required, placeholder, ...rest }
                ) => renderInputField(id, label, type, required, "", placeholder , rest))}

                {/* ✅ 사용 여부 (토글) */}
                <div className="flex items-center space-x-4">
                    <label className="w-32 text-sm font-medium text-gray-900">사용 여부 *</label>
                    <Switch checked={formData.use_yn === "Y"} onChange={handleToggleChange} />
                    <span className="text-sm text-gray-700">{formData.use_yn === "Y" ? "Yes" : "No"}</span>
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