import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateAccount, fetchAccountPart } from "@/service/accountService.js";

import { IoMdClose } from 'react-icons/io';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import { formatPhoneNumber, formatBusinessNumber } from "@/utils/formatHelpers.jsx";


const AccountEditPage = () => {
    const { acct_num } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        acct_num: "", // S_10132
        account_type: "", // 법인
        acct_name: "", // 코리아오브컴㈜
        acct_resident_num: "", // 8248700256
        regist_date: "", // 2024-12-01
        use_yn: "", // Y/N
        classification: "", // Korea Orbcomm
        invoice_postcode: "", // 15112(우편번호)
        invoice_address: "", // 서울특별시 - (청구소 주소)
        invoice_address2: "", // 주소2
        recognize_id: "", // 151-22155 (법인(주민)번호)
        company_tel: "", // 02-1515-1214
        tax_percent: "", // 1.2%
        business_num: "", // 123-51-11524 (사업자등록번호)
        company_name: "", // 코리아오브컴
        company_team: "", // 영업부
        company_director: "", // 홍길동
        director_email: "", // example@gmail.com
        director_tel: "", // 010-0000-0000
        company_postcode: "", // 11214
        company_address: "", // 서울특별시 - (주소)
        company_address2: "", // 주소2
    });
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    // ✅ 날짜 포맷 함수
    const formatDate = (datetime) => {
        if (!datetime) return "";
        return new Date(datetime).toISOString().slice(0, 10);
    };
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

                });  // 가져온 데이터를 폼에 채우기
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

    if (loading) return <LoadingSpinner/>;
    if (error) return <p>Error: {error}</p>;

    console.log(formData)
    return (
        <>
            <div className="container mx-auto">
                {/* Top */}
                <div className="flex flex-row justify-between mb-3">
                    {/* Title */}
                    <h1 className="py-1 text-lg font-bold">Account Edit Data</h1>

                    {/* Close */}
                    <button onClick={() => navigate('/accounts')}
                            className="flex flex-row items-center p-2 text-xl text-gray-600 hover:text-gray-900 transition">
                        <IoMdClose />
                    </button>
                </div>


                {/* Input Form Contents */}
                <form className="bg-white p-5 rounded-xl space-y-6" onSubmit={handleSubmit}>

                    {/* Account_Num */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="acct_num"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            고객 번호
                        </label>
                        <input
                            type="text"
                            id="acct_num"
                            name="acct_num"
                            value={formData.acct_num}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            readOnly // 수정 불가 설정(기본키가 변경되면 백에서 기존 데이터를 찾지 못하고 새롭게 생성하게 됨)
                            placeholder="KO_99999"
                        />
                    </div>

                    {/* Account_Type */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="account_type"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            고객 구분
                        </label>
                        <input
                            type="text"
                            id="account_type"
                            value={formData.account_type}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="법인"
                        />
                    </div>

                    {/* Account_Name */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="acct_name"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            고객명
                        </label>
                        <input
                            type="text"
                            id="acct_name"
                            name="acct_name"
                            value={formData.acct_name}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="코리아오브컴"
                            required
                        />
                    </div>

                    {/* Classification */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="classification"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            분류
                        </label>
                        <input
                            type="text"
                            id="classification"
                            name="classification"
                            value={formData.classification}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="내부"
                            required
                        />
                    </div>

                    {/* Account_Resident_Number */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="acct_resident_num"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            등록 번호
                        </label>
                        <input
                            type="number"
                            id="acct_resident_num"
                            name="acct_resident_num"
                            value={formData.acct_resident_num}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="0"
                            required
                        />
                    </div>

                    {/* Registration_Date */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="regist_date"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            등록일
                        </label>
                        <input
                            type="date"
                            id="regist_date"
                            name="regist_date"
                            value={formData.regist_date}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="0"
                            required
                        />
                    </div>

                    {/* tax_percent */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="tax_percent"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            부가 세율(%)
                        </label>
                        <input
                            type="number"
                            id="tax_percent"
                            value={formData.tax_percent}
                            onChange={handleChange}
                            min="0"  // 최소값 설정
                            max="100"  // 최대값 설정 (0% ~ 100%)
                            step="0.1"  // 소수점 단위 허용 (예: 10.5%)
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="1.0"
                            required
                        />
                    </div>

                    {/* Use Y/N */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="use_yn" className="col-start-1 text-sm font-medium text-gray-900">사용</label>
                        <div className="col-span-2 col-start-2 flex items-center space-x-4">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.use_yn === 'Y'}
                                    onChange={handleToggleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600"></div>
                                <div className="absolute w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition-all"></div>
                            </label>
                            <span className="text-sm text-gray-700">
                            {formData.use_yn === 'Y' ? 'Yes' : 'No'}
                        </span>
                        </div>
                    </div>

                    {/* company_name */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="company_name"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            회사명
                        </label>
                        <input
                            type="text"
                            id="company_name"
                            value={formData.company_name}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="코리아오브컴"
                        />
                    </div>

                    {/* ✅ 사업자 등록 번호 */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="business_num" className="col-start-1 col-end-1 text-sm font-medium text-gray-900 truncate">
                            사업자 등록 번호
                        </label>
                        <input
                            type="text"
                            id="business_num"
                            name="business_num"
                            value={formData.business_num}
                            onChange={handleChange}
                            className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                            placeholder="000-00-00000"
                        />
                    </div>

                    {/* recognize_id */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="recognize_id"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            법인(주민) 번호
                        </label>
                        <input
                            type="text"
                            id="recognize_id"
                            value={formData.recognize_id}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="000-0000"
                        />
                    </div>

                    {/* ✅ 회사 전화 번호 */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="company_tel" className="col-start-1 col-end-1 text-sm font-medium text-gray-900 truncate">
                            회사 전화 번호
                        </label>
                        <input
                            type="tel"
                            id="company_tel"
                            name="company_tel"
                            value={formData.company_tel}
                            onChange={handleChange}
                            className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                            placeholder="00-0000-0000"
                            pattern="[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}"
                        />
                    </div>

                    {/* invoice_postcode */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="invoice_postcode"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            우편 번호
                        </label>
                        <input
                            type="number"
                            id="invoice_postcode"
                            name="invoice_postcode"
                            value={formData.invoice_postcode}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="0"
                            required
                        />
                    </div>

                    {/* company_address */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="company_address"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            회사 주소
                        </label>
                        <input
                            type="text"
                            id="company_address"
                            value={formData.company_address}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="주소"
                        />
                    </div>

                    {/* company_address2 */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="company_address2"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            회사 상세 주소
                        </label>
                        <input
                            type="text"
                            id="company_address2"
                            value={formData.company_address2}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="주소2"
                        />
                    </div>

                    {/* company_team */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="company_team"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            팀명
                        </label>
                        <input
                            type="text"
                            id="company_team"
                            value={formData.company_team}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="OO부"
                        />
                    </div>

                    {/* company_director */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="company_director"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            담당자
                        </label>
                        <input
                            type="text"
                            id="company_director"
                            value={formData.company_director}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="홍길동"
                        />
                    </div>

                    {/* director_email */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="director_email"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            담당자 메일
                        </label>
                        <input
                            type="email"
                            id="director_email"
                            value={formData.director_email}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="example@gmail.com"
                        />
                    </div>

                    {/* ✅ 담당 전화 */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="director_tel" className="col-start-1 col-end-1 text-sm font-medium text-gray-900 truncate">
                            담당자 전화 번호
                        </label>
                        <input
                            type="tel"
                            id="director_tel"
                            name="director_tel"
                            value={formData.director_tel}
                            onChange={handleChange}
                            className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                            placeholder="000-0000-0000"
                            pattern="[0-9]{3}-[0-9]{3,4}-[0-9]{4}"
                        />
                    </div>

                    {/* company_postcode */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="company_postcode"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            청구지 우편 번호
                        </label>
                        <input
                            type="number"
                            id="company_postcode"
                            value={formData.company_postcode}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="00000"
                        />
                    </div>

                    {/* invoice_address */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="invoice_address"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            청구지 주소
                        </label>
                        <input
                            type="text"
                            id="invoice_address"
                            name="invoice_address"
                            value={formData.invoice_address}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="서울특별시 서초구 강남대로 525, 15층"
                            required
                        />
                    </div>

                    {/* invoice_address2 */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="invoice_address2"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            청구지 상세 주소
                        </label>
                        <input
                            type="text"
                            id="invoice_address2"
                            name="invoice_address2"
                            value={formData.invoice_address2}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder=""
                            required
                        />
                    </div>



                    <button type="submit"
                            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit
                    </button>
                    <button type="button"
                            onClick={() => navigate("/accounts")}
                            className="ml-4 text-gray-700 bg-gray-300 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800">Cancel
                    </button>

                    {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
                </form>
            </div>
        </>
    );
};

export default AccountEditPage;
