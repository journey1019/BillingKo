import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createAccount, fetchAccounts } from "@/service/accountService.js";
import { IoMdClose } from "react-icons/io";
import { Switch } from "@mui/material";

const AccountNewPage = () => {
    const navigate = useNavigate();

    // ✅ 오늘 날짜 구하기 (YYYY-MM-DD 형식)
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0]; // "YYYY-MM-DD" 형식
    };

    // ✅ 기존 계정 데이터 불러오기 (중복 체크용)
    const [accountData, setAccountData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchAccounts();
                setAccountData(response);
            } catch (error) {
                console.error("계정 데이터를 불러오는 중 오류 발생", error);
            }
        };
        fetchData();
    }, []);

    // ✅ 폼 데이터 상태 관리
    const [formData, setFormData] = useState({
        acct_num: "",
        acct_name: "",
        acct_resident_num: "",
        regist_date: getTodayDate(), // 오늘 날짜를 초기값으로 설정
        classification: "",
        invoice_address: "",
        invoice_postcode: "",
        use_yn: "N",
        account_type: null,
        invoice_address2: null,
        recognize_id: null,
        company_tel: null,
        tax_percent: null,
        business_num: null,
        company_name: null,
        company_team: null,
        company_director: null,
        director_email: null,
        director_tel: null,
        company_postcode: null,
        company_address: null,
        company_address2: null,
    });

    const [error, setError] = useState(null);
    const [acctNumError, setAcctNumError] = useState("");

    // ✅ 중복 체크 함수
    const isDuplicateAccountNum = (acctNum) => {
        return accountData.some((account) => account.acct_num === acctNum);
    };

    // ✅ 입력 변경 핸들러 (중복 검사 포함)
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value || null });

        if (id === "acct_num") {
            if (isDuplicateAccountNum(value)) {
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
            "acct_num",
            "acct_name",
            "acct_resident_num",
            "regist_date",
            "classification",
            "invoice_address",
            "invoice_postcode",
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

        if (isDuplicateAccountNum(formData.acct_num)) {
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

    const renderInputField = (id, label, type, required, errorMessage, extraProps = {}) => (
        <div className="flex items-center space-x-4" key={id}>
            <label htmlFor={id} className="w-32 text-sm font-medium text-gray-900">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="flex-1">
                <input id={id} type={type} value={formData[id]} onChange={handleInputChange}
                       className={`w-full bg-gray-50 border ${errorMessage ? "border-red-500" : "border-gray-300"} text-gray-900 text-sm rounded-lg p-2.5`}
                       {...extraProps} required={required}/>
                {errorMessage && <p className="text-red-500 text-xs mt-1">{errorMessage}</p>}
            </div>
        </div>
    );


    return (
        <div className="container mx-auto">
            {/* ✅ 상단 타이틀 및 닫기 버튼 */}
            <div className="flex flex-row justify-between mb-3">
                <h1 className="py-1 text-lg font-bold">신규 계정 등록</h1>
                <button onClick={() => navigate("/accounts")}
                        className="flex flex-row items-center p-2 text-xl text-gray-600 hover:text-gray-900 transition">
                    <IoMdClose />
                </button>
            </div>

            {/* ✅ 입력 폼 */}
            <form className="bg-white p-5 rounded-xl space-y-4" onSubmit={handleSubmit}>
                {/* ✅ 고객번호 (중복 검사 포함) */}
                {renderInputField("acct_num", "고객번호", "text", true, acctNumError)}

                {/* ✅ 사용 여부 (토글) */}
                <div className="flex items-center space-x-4">
                    <label className="w-32 text-sm font-medium text-gray-900">사용 여부 *</label>
                    <Switch checked={formData.use_yn === "Y"} onChange={handleToggleChange} />
                    <span className="text-sm text-gray-700">{formData.use_yn === "Y" ? "Yes" : "No"}</span>
                </div>

                {/* ✅ 나머지 입력 필드 자동 생성 */}
                {[
                    { id: "acct_name", label: "고객명", type: "text", required: true },
                    { id: "acct_resident_num", label: "등록번호", type: "number", required: true },
                    { id: "regist_date", label: "등록일", type: "date", required: true },
                    { id: "classification", label: "분류", type: "text", required: true },
                    { id: "invoice_address", label: "청구 주소", type: "text", required: true },
                    { id: "invoice_postcode", label: "우편번호", type: "number", required: true },
                    { id: "invoice_address2", label: "상세 주소", type: "text", required: true },
                    { id: "account_type", label: "계정 유형", type: "text", required: true },
                    { id: "recognize_id", label: "사업자 등록번호", type: "text", required: true },
                    {
                        id: "company_tel",
                        label: "직장전화",
                        type: "tel",
                        pattern: "[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}",
                        placeholder: "00-0000-0000",
                        required: true
                    },
                    {
                        id: "tax_percent",
                        label: "부가세율 (%)",
                        type: "number",
                        min: "0",
                        max: "100",
                        step: "0.1",
                        required: false
                    },
                    { id: "business_num", label: "법인번호", type: "number", required: false },
                    { id: "company_name", label: "직장명", type: "text", required: false },
                    { id: "company_team", label: "부서/팀", type: "text", required: false },
                    { id: "company_director", label: "담당자", type: "text", required: false },
                    {
                        id: "director_email",
                        label: "담당 이메일",
                        type: "email",
                        placeholder: "example@gmail.com",
                        required: false
                    },
                    {
                        id: "director_tel",
                        label: "담당 전화",
                        type: "tel",
                        pattern: "[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}",
                        placeholder: "000-0000-0000",
                        required: false
                    },
                    { id: "company_postcode", label: "회사 우편번호", type: "number", required: false },
                    { id: "company_address", label: "회사 주소", type: "text", required: false },
                    { id: "company_address2", label: "회사 상세주소", type: "text", required: false },
                ].map(({
                           id,
                           label,
                           type,
                           required,
                           ...rest
                       }) => renderInputField(id, label, type, required, "", rest))}

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