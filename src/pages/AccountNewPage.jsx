import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { createAccount } from '@/service/accountService';

import { IoMdClose } from 'react-icons/io';

const AccountNewPage = () => {
    const navigate = useNavigate();

    // 폼 데이터 상태 관리
    const [formData, setFormData] = useState({
        account_number: "",
        acct_name: "",
        acct_resident_num: "",
        classification: "",
        invoice_address: "",
        invoice_address2: "",
        invoice_postcode: "",
    });

    const [error, setError] = useState(null);

    // 폼 입력 값 변경 핸들러
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const validateFormData = () => {
        for (const key in formData) {
            if (!formData[key]) {
                return `The field "${key}" is required.`;
            }
        }
        return null;
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateFormData();
        if (validationError) {
            setError(validationError);
            return;
        }

        const confirmMessage = `
            Please confirm the following details:
            Account Number: ${formData.account_number}
            Account Name: ${formData.acct_name}
            Resident Number: ${formData.acct_resident_num}
            Classification: ${formData.classification}
            Invoice Address: ${formData.invoice_address}
            Invoice Address 2: ${formData.invoice_address2}
            Invoice Postcode: ${formData.invoice_postcode}
        `;

        if (!window.confirm(confirmMessage)) {
            return;
        }

        try {
            await createAccount(formData);
            alert("Account successfully created.");
            navigate("/accounts");
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to create account.");
        }
    };

    return (
        <>
            <div className="container mx-auto">
                <div className="flex flex-row justify-between mb-3">
                    {/* Title */}
                    <h1 className="py-1 text-lg font-bold">Account New Data</h1>

                    {/* 페이지 이동 */}
                    <button onClick={() => navigate('/accounts')}
                            className="flex flex-row items-center p-2 text-xl text-gray-600 hover:text-gray-900 transition">
                        <IoMdClose />
                    </button>
                </div>

                {/* Input Form Contents */}
                <form className="bg-white p-5 rounded-xl space-y-6"
                      onSubmit={handleSubmit}
                >
                    {/* Account_Num */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="account_number"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            Account Number
                        </label>
                        <input
                            type="text"
                            id="account_number"
                            value={formData.account_number}
                            onChange={handleInputChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="KO_99999"
                            required
                        />
                    </div>
                    {/* Account_Name */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="acct_name"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            Account Name
                        </label>
                        <input
                            type="text"
                            id="acct_name"
                            value={formData.acct_name}
                            onChange={handleInputChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="코리아오브컴"
                            required
                        />
                    </div>
                    {/* Account_Resident_Number */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="acct_resident_num"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            Account Resident Number
                        </label>
                        <input
                            type="number"
                            id="acct_resident_num"
                            value={formData.acct_resident_num}
                            onChange={handleInputChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="0"
                            required
                        />
                    </div>
                    {/* Classification */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="classification"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            Classification
                        </label>
                        <input
                            type="text"
                            id="classification"
                            value={formData.classification}
                            onChange={handleInputChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="내부"
                            required
                        />
                    </div>
                    {/* invoice_address */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="invoice_address"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            Invoice Address
                        </label>
                        <input
                            type="text"
                            id="invoice_address"
                            value={formData.invoice_address}
                            onChange={handleInputChange}
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
                            Invoice Address 2
                        </label>
                        <input
                            type="text"
                            id="invoice_address2"
                            value={formData.invoice_address2}
                            onChange={handleInputChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder=""
                            required
                        />
                    </div>
                    {/* invoice_postcode */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="invoice_postcode"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            Invoice Postcode
                        </label>
                        <input
                            type="number"
                            id="invoice_postcode"
                            value={formData.invoice_postcode}
                            onChange={handleInputChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="0"
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
export default AccountNewPage;