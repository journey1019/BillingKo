import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateAccount, fetchAccountHistory } from "@/service/accountService.js";

import { IoMdClose } from 'react-icons/io';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';

const AccountEditPage = () => {
    const { acct_num } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        acct_num: "",
        acct_name: "",
        acct_resident_num: "",
        classification: "",
        invoice_address: "",
        invoice_address2: "",
        invoice_postcode: "",
    });
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadAccountData = async () => {
            try {
                const account = await fetchAccountHistory(acct_num);
                setFormData(account);  // 가져온 데이터를 폼에 채우기
            } catch (err) {
                setError("Failed to fetch account data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadAccountData();
    }, [acct_num]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

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
                <form className="bg-white p-5 rounded-xl space-y-6"
                      onSubmit={handleSubmit}
                >
                    {/* Account_Num */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="acct_num"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            Account Number
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
                            name="acct_name"
                            value={formData.acct_name}
                            onChange={handleChange}
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
                            name="acct_resident_num"
                            value={formData.acct_resident_num}
                            onChange={handleChange}
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
                            name="classification"
                            value={formData.classification}
                            onChange={handleChange}
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
                            Invoice Address 2
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
                            name="invoice_postcode"
                            value={formData.invoice_postcode}
                            onChange={handleChange}
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

export default AccountEditPage;
