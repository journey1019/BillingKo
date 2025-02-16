import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createAccount, fetchAccounts } from "@/service/accountService.js";
import { IoMdClose } from "react-icons/io";
import { Switch } from "@mui/material";

const AccountNewPage = () => {
    const navigate = useNavigate();

    // ✅ 기존 계정 데이터 불러오기 (중복 체크용)
    const [accountData, setAccountData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchAccounts();  // API 호출
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
        account_type: "",
        acct_name: "",
        acct_resident_num: "",
        regist_date: "",
        use_yn: "N",
        classification: "",
        invoice_postcode: "",
        invoice_address: "",
        invoice_address2: "",
        recognize_id: "",
        company_tel: "",
        tax_percent: "",
        business_num: "",
        company_name: "",
        company_team: "",
        company_director: "",
        director_email: "",
        director_tel: "",
        company_postcode: "",
        company_address: "",
        company_address2: "",
    });

    const [error, setError] = useState(null);
    const [acctNumError, setAcctNumError] = useState(""); // 중복 오류 메시지

    // ✅ 중복 체크 함수
    const isDuplicateAccountNum = (acctNum) => {
        return accountData.some((account) => account.acct_num === acctNum);
    };

    // ✅ 입력 변경 핸들러 (중복 검사 포함)
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });

        if (id === "acct_num") {
            if (isDuplicateAccountNum(value)) {
                setAcctNumError("이미 존재하는 계정 번호입니다.");
            } else {
                setAcctNumError("");  // 중복 없으면 초기화
            }
        }
    };

    // ✅ 토글 버튼 핸들러 (사용 유무)
    const handleToggleChange = (e) => {
        setFormData({ ...formData, use_yn: e.target.checked ? "Y" : "N" });
    };

    // ✅ 폼 검증 함수
    const validateFormData = () => {
        if (acctNumError) return acctNumError; // 중복 오류 있으면 제출 방지
        for (const key in formData) {
            if (!formData[key]) {
                return `필수 입력 항목: ${key}`;
            }
        }
        return null;
    };

    // ✅ 폼 제출 핸들러 (최종 중복 검사 포함)
    const handleSubmit = async (e) => {
        e.preventDefault();

        // ❗ API 요청 전 중복 검사 다시 실행
        if (isDuplicateAccountNum(formData.acct_num)) {
            setAcctNumError("이미 존재하는 계정 번호입니다.");
            return;
        }

        const validationError = validateFormData();
        if (validationError) {
            setError(validationError);
            return;
        }

        const confirmMessage = `
            계정 번호: ${formData.acct_num}
            계정 유형: ${formData.account_type}
            고객명: ${formData.acct_name}
            등록번호: ${formData.acct_resident_num}
            등록일: ${formData.regist_date}
            사용 여부: ${formData.use_yn === "Y" ? "사용 중" : "미사용"}
            주소: (${formData.invoice_postcode}) ${formData.invoice_address}, ${formData.invoice_address2}
        `;

        if (!window.confirm(confirmMessage)) return;

        try {
            await createAccount(formData);
            alert("계정이 성공적으로 생성되었습니다.");
            navigate("/accounts");
        } catch (err) {
            setError(err.response?.data?.detail || "계정 생성에 실패했습니다.");
        }
    };

    return (
        <div className="container mx-auto">
            <div className="flex flex-row justify-between mb-3">
                <h1 className="py-1 text-lg font-bold">신규 계정 등록</h1>
                <button onClick={() => navigate("/accounts")}
                        className="flex flex-row items-center p-2 text-xl text-gray-600 hover:text-gray-900 transition">
                    <IoMdClose />
                </button>
            </div>

            <form className="bg-white p-5 rounded-xl space-y-6" onSubmit={handleSubmit}>
                {/* ✅ 중복 검사 추가된 계정 번호 필드 */}
                <div className="block space-y-2 md:grid md:grid-cols-6 items-center md:space-x-4">
                    <label htmlFor="acct_num" className="block md:col-start-1 md:col-end-1 text-sm font-medium text-gray-900 truncate">
                        고객번호
                    </label>
                    <div className="md:col-span-2 md:col-start-2">
                        <input
                            type="text"
                            id="acct_num"
                            value={formData.acct_num}
                            onChange={handleInputChange}
                            className={`w-full bg-gray-50 border ${acctNumError ? "border-red-500" : "border-gray-300"} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5`}
                            placeholder="KO_99999"
                            required
                        />
                        {acctNumError && <p className="text-red-500 text-xs mt-1">{acctNumError}</p>}
                    </div>
                </div>

                {/* ✅ 사용 여부 (토글) */}
                <div className="block space-y-2 md:grid md:grid-cols-6 items-center md:space-x-4">
                    <label className="block md:col-start-1 md:col-end-1 text-sm font-medium text-gray-900 truncate">
                        사용 여부
                    </label>
                    <div className="col-span-2 col-start-2 flex items-center space-x-4">
                        <Switch checked={formData.use_yn === "Y"} onChange={handleToggleChange} />
                        <span className="text-sm text-gray-700">{formData.use_yn === "Y" ? "Yes" : "No"}</span>
                    </div>
                </div>

                {/* Account_Type */}
                <div className="block space-y-2 md:grid md:grid-cols-6 items-center md:space-x-4">
                    <label
                        htmlFor="account_type"
                        className="block md:col-start-1 md:col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                    >
                        고객구분
                    </label>
                    <input
                        type="text"
                        id="account_type"
                        value={formData.account_type}
                        onChange={handleInputChange}
                        className="md:col-span-2 md:col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                        placeholder="법인"
                    />
                </div>

                {/* Account_Name */}
                <div className="block space-y-2 md:grid md:grid-cols-6 items-center md:space-x-4">
                    <label
                        htmlFor="acct_name"
                        className="block md:col-start-1 md:col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                    >
                        고객명
                    </label>
                    <input
                        type="text"
                        id="acct_name"
                        value={formData.acct_name}
                        onChange={handleInputChange}
                        className="md:col-span-2 md:col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                        placeholder="코리아오브컴"
                        required
                    />
                </div>

                {/* Account_Resident_Number */}
                <div className="block space-y-2 md:grid md:grid-cols-6 items-center md:space-x-4">
                    <label
                        htmlFor="acct_resident_num"
                        className="block md:col-start-1 md:col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                    >
                        등록번호
                    </label>
                    <input
                        type="number"
                        id="acct_resident_num"
                        value={formData.acct_resident_num}
                        onChange={handleInputChange}
                        className="md:col-span-2 md:col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                        placeholder="0"
                        required
                    />
                </div>

                {/* Registration_Date */}
                <div className="block space-y-2 md:grid md:grid-cols-6 items-center md:space-x-4">
                    <label
                        htmlFor="regist_date"
                        className="block md:col-start-1 md:col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                    >
                        등록일
                    </label>
                    <input
                        type="date"
                        id="regist_date"
                        value={formData.regist_date}
                        onChange={handleInputChange}
                        className="md:col-span-2 md:col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                        placeholder="0"
                        required
                    />
                </div>

                {/* Use_yn */}
                {/*<div className="block space-y-2 md:grid md:grid-cols-6 items-center md:space-x-4">*/}
                {/*    <label*/}
                {/*        htmlFor="use_yn"*/}
                {/*        className="block md:col-start-1 md:col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"*/}
                {/*    >*/}
                {/*        사용*/}
                {/*    </label>*/}
                {/*    <div className="col-span-2 col-start-2 flex items-center space-x-4">*/}
                {/*        /!* Toggle 버튼 *!/*/}
                {/*        <label className="relative inline-flex items-center cursor-pointer">*/}
                {/*            <input*/}
                {/*                type="checkbox"*/}
                {/*                id="use_yn"*/}
                {/*                checked={formData.use_yn === 'Y'} // Y일 경우 체크*/}
                {/*                onChange={(e) =>*/}
                {/*                    handleInputChange({*/}
                {/*                        target: { id: 'use_yn', value: e.target.checked ? 'Y' : 'N' },*/}
                {/*                    })*/}
                {/*                }*/}
                {/*                className="sr-only peer"*/}
                {/*            />*/}
                {/*            <div*/}
                {/*                className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600"></div>*/}
                {/*            <div*/}
                {/*                className="absolute w-5 h-5 bg-white rounded-full shadow-lg transform peer-checked:translate-x-5 transition-all"></div>*/}
                {/*        </label>*/}
                {/*        <span className="text-sm text-gray-700">*/}
                {/*                {formData.use_yn === 'Y' ? 'Yes' : 'No'}*/}
                {/*            </span>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/* Classification */}
                <div className="block space-y-2 md:grid md:grid-cols-6 items-center md:space-x-4">
                    <label
                        htmlFor="classification"
                        className="block md:col-start-1 md:col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                    >
                        분류
                    </label>
                    <input
                        type="text"
                        id="classification"
                        value={formData.classification}
                        onChange={handleInputChange}
                        className="md:col-span-2 md:col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                        placeholder="내부"
                        required
                    />
                </div>

                {/* invoice_postcode */}
                <div className="block space-y-2 md:grid md:grid-cols-6 items-center md:space-x-4">
                    <label
                        htmlFor="invoice_postcode"
                        className="block md:col-start-1 md:col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                    >
                        우편번호
                    </label>
                    <input
                        type="number"
                        id="invoice_postcode"
                        value={formData.invoice_postcode}
                        onChange={handleInputChange}
                        className="md:col-span-2 md:col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                        placeholder="0"
                        required
                    />
                </div>

                {/* invoice_address */}
                <div className="block space-y-2 md:grid md:grid-cols-6 items-center md:space-x-4">
                    <label
                        htmlFor="invoice_address"
                        className="block md:col-start-1 md:col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                    >
                        주소
                    </label>
                    <input
                        type="text"
                        id="invoice_address"
                        value={formData.invoice_address}
                        onChange={handleInputChange}
                        className="md:col-span-2 md:col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                        placeholder="서울특별시 서초구 강남대로 525, 15층"
                        required
                    />
                </div>

                {/* invoice_address2 */}
                <div className="block space-y-2 md:grid md:grid-cols-6 items-center md:space-x-4">
                    <label
                        htmlFor="invoice_address2"
                        className="block md:col-start-1 md:col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                    >
                        주소2
                    </label>
                    <input
                        type="text"
                        id="invoice_address2"
                        value={formData.invoice_address2}
                        onChange={handleInputChange}
                        className="md:col-span-2 md:col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                        placeholder=""
                        required
                    />
                </div>

                {/* recognize_id */}
                <div className="block space-y-2 md:grid md:grid-cols-6 items-center md:space-x-4">
                    <label
                        htmlFor="recognize_id"
                        className="block md:col-start-1 md:col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                    >
                        사업자 등록번호
                    </label>
                    <input
                        type="text"
                        id="recognize_id"
                        value={formData.recognize_id}
                        onChange={handleInputChange}
                        className="md:col-span-2 md:col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                        placeholder="000-0000"
                        required
                    />
                </div>

                {/* company_tel */}
                <div className="block space-y-2 md:grid md:grid-cols-6 items-center md:space-x-4">
                    <label
                        htmlFor="company_tel"
                        className="block md:col-start-1 md:col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                    >
                        직장전화
                    </label>
                    <input
                        type="tel"
                        id="company_tel"
                        value={formData.company_tel}
                        onChange={handleInputChange}
                        pattern="[0-9]{3}-[0-9]{3,4}-[0-9]{4}"  // 패턴 추가 (형식: 000-0000-0000)
                        className="md:col-span-2 md:col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                        placeholder="000-0000-0000"
                        required
                    />
                </div>

                {/* tax_percent */}
                <div className="block space-y-2 md:grid md:grid-cols-6 items-center md:space-x-4">
                    <label
                        htmlFor="tax_percent"
                        className="block md:col-start-1 md:col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                    >
                        적용부가세율(%)
                    </label>
                    <input
                        type="number"
                        id="tax_percent"
                        value={formData.tax_percent}
                        onChange={handleInputChange}
                        min="0"  // 최소값 설정
                        max="100"  // 최대값 설정 (0% ~ 100%)
                        step="0.1"  // 소수점 단위 허용 (예: 10.5%)
                        className="md:col-span-2 md:col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                        placeholder="1.0"
                        required
                    />
                </div>

                {/* business_num */}
                <div className="block space-y-2 md:grid md:grid-cols-6 items-center md:space-x-4">
                    <label
                        htmlFor="business_num"
                        className="block md:col-start-1 md:col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                    >
                        법인번호
                    </label>
                    <input
                        type="number"
                        id="business_num"
                        value={formData.business_num}
                        onChange={handleInputChange}
                        className="md:col-span-2 md:col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                        placeholder="000-0000"
                        required
                    />
                </div>

                {/* company_name */}
                <div className="block space-y-2 md:grid md:grid-cols-6 items-center md:space-x-4">
                    <label
                        htmlFor="company_name"
                        className="block md:col-start-1 md:col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                    >
                        직장명
                    </label>
                    <input
                        type="text"
                        id="company_name"
                        value={formData.company_name}
                        onChange={handleInputChange}
                        className="md:col-span-2 md:col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                        placeholder="코리아오브컴"
                        required
                    />
                </div>

                {/* company_team */}
                <div className="block space-y-2 md:grid md:grid-cols-6 items-center md:space-x-4">
                    <label
                        htmlFor="company_team"
                        className="block md:col-start-1 md:col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                    >
                        부서/팀
                    </label>
                    <input
                        type="text"
                        id="company_team"
                        value={formData.company_team}
                        onChange={handleInputChange}
                        className="md:col-span-2 md:col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                        placeholder="OO부"
                        required
                    />
                </div>

                {/* company_director */}
                <div className="block space-y-2 md:grid md:grid-cols-6 items-center md:space-x-4">
                    <label
                        htmlFor="company_director"
                        className="block md:col-start-1 md:col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                    >
                        담당자
                    </label>
                    <input
                        type="text"
                        id="company_director"
                        value={formData.company_director}
                        onChange={handleInputChange}
                        className="md:col-span-2 md:col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                        placeholder="홍길동"
                        required
                    />
                </div>

                {/* director_email */}
                <div className="block space-y-2 md:grid md:grid-cols-6 items-center md:space-x-4">
                    <label
                        htmlFor="director_email"
                        className="block md:col-start-1 md:col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                    >
                        담당메일
                    </label>
                    <input
                        type="email"
                        id="director_email"
                        value={formData.director_email}
                        onChange={handleInputChange}
                        className="md:col-span-2 md:col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                        placeholder="example@gmail.com"
                        required
                    />
                </div>

                {/* director_tel */}
                <div className="block space-y-2 md:grid md:grid-cols-6 items-center md:space-x-4">
                    <label
                        htmlFor="director_tel"
                        className="block md:col-start-1 md:col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                    >
                        담당전화
                    </label>
                    <input
                        type="tel"
                        id="director_tel"
                        value={formData.director_tel}
                        onChange={handleInputChange}
                        className="md:col-span-2 md:col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                        placeholder="000-0000-0000"
                        pattern="[0-9]{3}-[0-9]{3,4}-[0-9]{4}"  // 패턴 추가 (형식: 000-0000-0000)
                        required
                    />
                </div>

                {/* company_postcode */}
                <div className="block space-y-2 md:grid md:grid-cols-6 items-center md:space-x-4">
                    <label
                        htmlFor="company_postcode"
                        className="block md:col-start-1 md:col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                    >
                        우편번호
                    </label>
                    <input
                        type="number"
                        id="company_postcode"
                        value={formData.company_postcode}
                        onChange={handleInputChange}
                        className="md:col-span-2 md:col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                        placeholder="00000"
                        required
                    />
                </div>

                {/* company_address */}
                <div className="block space-y-2 md:grid md:grid-cols-6 items-center md:space-x-4">
                    <label
                        htmlFor="company_address"
                        className="block md:col-start-1 md:col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                    >
                        청구소 주소
                    </label>
                    <input
                        type="text"
                        id="company_address"
                        value={formData.company_address}
                        onChange={handleInputChange}
                        className="md:col-span-2 md:col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                        placeholder="주소"
                        required
                    />
                </div>

                {/* company_address2 */}
                <div className="block space-y-2 md:grid md:grid-cols-6 items-center md:space-x-4">
                    <label
                        htmlFor="company_address2"
                        className="block md:col-start-1 md:col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                    >
                        청구소 주소2
                    </label>
                    <input
                        type="text"
                        id="company_address2"
                        value={formData.company_address2}
                        onChange={handleInputChange}
                        className="md:col-span-2 md:col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                        placeholder="주소2"
                        required
                    />
                </div>

                <div className="flex space-x-4">
                    <button type="submit"
                            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                            disabled={!!acctNumError}> {/* 중복이면 버튼 비활성화 */}
                        저장
                    </button>
                    <button type="button"
                            onClick={() => navigate("/accounts")}
                            className="text-gray-700 bg-gray-300 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
                        취소
                    </button>
                </div>

                {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
            </form>
        </div>
    );
};

export default AccountNewPage;
