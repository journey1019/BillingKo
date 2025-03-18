import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateAccount, fetchAccountPart } from "@/service/accountService.js";
import { IoMdClose } from "react-icons/io";
import LoadingSpinner from "@/components/common/LoadingSpinner.jsx";
import { formatPhoneNumber, formatBusinessNumber } from "@/utils/formatHelpers.jsx";
import { Switch } from "@mui/material";

const AccountEditPage = () => {
    const { acct_num } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        acct_num: "", account_type: "", acct_name: "", acct_resident_num: "",
        regist_date: "", use_yn: "", classification: "", invoice_postcode: "",
        invoice_address: "", invoice_address2: "", recognize_id: "",
        company_tel: "", tax_percent: "", business_num: "",
        company_name: "", company_team: "", company_director: "",
        director_email: "", director_tel: "", company_postcode: "",
        company_address: "", company_address2: "",
    });

    // ✅ 날짜 포맷 함수
    const formatDate = (datetime) => (datetime ? new Date(datetime).toISOString().slice(0, 10) : "");

    // ✅ 데이터 불러오기
    useEffect(() => {
        const loadAccountData = async () => {
            try {
                const account = await fetchAccountPart(acct_num);
                setFormData({
                    ...account,
                    regist_date: formatDate(account.regist_date),
                    company_tel: formatPhoneNumber(account.company_tel),
                    director_tel: formatPhoneNumber(account.director_tel),
                    business_num: formatBusinessNumber(account.business_num),
                });
            } catch (err) {
                setError("Failed to fetch account data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadAccountData();
    }, [acct_num]);

    // ✅ 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // 전화번호 & 사업자 등록번호 변환
        if (name === "company_tel" || name === "director_tel") {
            formattedValue = formatPhoneNumber(value);
        } else if (name === "business_num") {
            formattedValue = formatBusinessNumber(value);
        }

        setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    };

    // ✅ Yes / No 토글
    const handleToggleChange = () => {
        setFormData((prev) => ({ ...prev, use_yn: prev.use_yn === 'Y' ? 'N' : 'Y' }));
    };

    // ✅ 수정 요청
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("PUT 요청 보낼 데이터", formData);
            await updateAccount(acct_num, formData);
            alert("Account updated successfully!");
            navigate("/accounts");
        } catch (err) {
            console.error(err.message);
            setError("Failed to update account");
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <p className="text-red-500 text-sm mt-3">{error}</p>;

    const InputField = ({ id, label, type, value, onChange, ...props }) => (
        <div className="grid grid-cols-6 items-center space-x-4">
            <label htmlFor={id} className="col-start-1 text-sm font-medium text-gray-900">{label}</label>
            <input id={id} type={type} value={value} onChange={onChange}
                   className="col-span-2 bg-gray-50 border border-gray-300 text-sm rounded-lg p-2.5" {...props} />
        </div>
    );

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
                {[
                    { id: 'acct_num', label: '고객 번호', type: 'text', readOnly: true, placeholder: 'KO_99999' },
                    { id: 'account_type', label: '고객 구분', type: 'text', placeholder: '법인' },
                    { id: 'acct_name', label: '고객명', type: 'text', placeholder: '코리아오브컴', required: true },
                    { id: 'classification', label: '분류', type: 'text', placeholder: '내부' },
                    { id: 'acct_resident_num', label: '등록 번호', type: 'number', placeholder: '0' },
                    { id: 'regist_date', label: '등록일', type: 'date' },
                    {
                        id: 'tax_percent',
                        label: '부가 세율(%)',
                        type: 'number',
                        min: 0,
                        max: 100,
                        step: 0.1,
                        placeholder: '1.0',
                    },
                    { id: 'business_num', label: '사업자 등록 번호', type: 'text', placeholder: '000-00-00000' },
                    { id: 'recognize_id', label: '법인(주민) 번호', type: 'text', placeholder: '000-0000' },
                    {
                        id: 'company_tel',
                        label: '회사 전화 번호',
                        type: 'tel',
                        placeholder: '00-0000-0000',
                        pattern: '[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}',
                    },
                    {
                        id: 'director_tel',
                        label: '담당 전화 번호',
                        type: 'tel',
                        placeholder: '000-0000-0000',
                        pattern: '[0-9]{3}-[0-9]{3,4}-[0-9]{4}',
                    },
                    { id: 'company_name', label: '회사명', type: 'text', placeholder: '코리아오브컴' },
                    { id: 'company_team', label: '팀명', type: 'text', placeholder: 'OO부' },
                    { id: 'company_director', label: '담당자', type: 'text', placeholder: '홍길동' },
                    { id: 'director_email', label: '담당자 메일', type: 'email', placeholder: 'example@gmail.com' },
                    { id: 'company_postcode', label: '회사 우편번호', type: 'number', placeholder: '00000' },
                    { id: 'company_address', label: '회사 주소', type: 'text', placeholder: '서울특별시 서초구 강남대로 525, 15층' },
                    { id: 'company_address2', label: '회사 상세 주소', type: 'text' },
                    { id: 'invoice_address', label: '청구지 주소', type: 'text' },
                    { id: 'invoice_address2', label: '청구지 상세 주소', type: 'text' },
                ].map(({ id, label, type, ...rest }) => (
                    <InputField key={id} id={id} label={label} type={type} value={formData[id]}
                                onChange={handleChange} {...rest} />
                ))}

                {/* ✅ 사용 여부 (토글 스위치) */}
                {/*<div className="grid grid-cols-6 items-center space-x-4">*/}
                {/*    <label htmlFor="use_yn" className="col-start-1 text-sm font-medium text-gray-900">사용</label>*/}
                {/*    <Switch checked={formData.use_yn === "Y"} onChange={handleToggleChange} />*/}
                {/*    <span className="text-sm text-gray-700">{formData.use_yn === "Y" ? "Yes" : "No"}</span>*/}
                {/*</div>*/}
                <div className="flex items-center space-x-4">
                    <label className="w-32 text-sm font-medium text-gray-900">사용 여부 *</label>
                    <Switch checked={formData.use_yn === 'Y'} onChange={handleToggleChange} />
                    <span className="text-sm text-gray-700">{formData.use_yn === 'Y' ? 'Yes' : 'No'}</span>
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
