import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { createPrice } from '@/service/priceService';

import { IoMdClose } from 'react-icons/io';

const PriceNewPage = () => {
    const navigate = useNavigate();

    // 폼 데이터 상태 관리
    const [formData, setFormData] = useState({
        ppid: "",
        basic_fee: "",
        subscription_fee: "",
        free_byte: "",
        surcharge_unit: "",
        each_surcharge_fee: "",
        apply_company: "",
        remarks: "",
        note: "",
    });

    const [error, setError] = useState(null);

    // 폼 입력 값 변경 핸들러
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const validateFormData = () => {
        // 필수 입력 필드에 대한 유효성 검사 (remarks, note 제외)
        const requiredFields = [
            "ppid", "basic_fee", "subscription_fee",
            "free_byte", "surcharge_unit",
            "each_surcharge_fee", "apply_company"
        ];

        for (const field of requiredFields) {
            if (!formData[field]) {
                return `The field "${field}" is required.`;
            }
        }
        return null;
    };

    const convertEmptyToDefault = (data) => {
        const updatedData = { ...data };

        // 각 필드가 비어 있으면 null 대신 기본값 설정
        if (!updatedData.each_surcharge_fee || updatedData.each_surcharge_fee.trim() === "") {
            updatedData.each_surcharge_fee = "0.0";  // 기본값 설정
        }

        // remarks와 note는 null 허용
        ["remarks", "note"].forEach((field) => {
            if (!updatedData[field] || updatedData[field].trim() === "") {
                updatedData[field] = null;
            }
        });

        return updatedData;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateFormData();
        if (validationError) {
            setError(validationError);
            return;
        }

        // 비어 있는 필드에 대해 기본값 처리
        const confirmedData = convertEmptyToDefault(formData);

        try {
            await createPrice(confirmedData);
            alert("Price successfully created.");
            navigate("/price");
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to create price.");
        }
    };


    return (
        <>
            <div className="container mx-auto">
                <div className="flex flex-row justify-between mb-3">
                    {/* Title */}
                    <h1 className="py-1 text-lg font-bold">Price New Data</h1>

                    {/* 페이지 이동 */}
                    <button onClick={() => navigate('/price')}
                            className="flex flex-row items-center p-2 text-xl text-gray-600 hover:text-gray-900 transition">
                        <IoMdClose />
                    </button>
                </div>

                {/* Input Form Contents */}
                <form className="bg-white p-5 rounded-xl space-y-6" onSubmit={handleSubmit}>

                    {/* PPID */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="ppid"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            PPID
                        </label>
                        <input
                            type="number"
                            id="ppid"
                            value={formData.ppid}
                            onChange={handleInputChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="999"
                            required
                        />
                    </div>
                    {/* Basic_Fee */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="basic_fee"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            Basic Fee
                        </label>
                        <input
                            type="number"
                            id="basic_fee"
                            value={formData.basic_fee}
                            onChange={handleInputChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="0"
                            required
                        />
                    </div>
                    {/* Subscription_Fee */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="subscription_fee"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            Subscription Fee
                        </label>
                        <input
                            type="number"
                            id="subscription_fee"
                            value={formData.subscription_fee}
                            onChange={handleInputChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="0"
                            required
                        />
                    </div>
                    {/* Free_Byte */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="free_byte"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            Free Byte
                        </label>
                        <input
                            type="number"
                            id="free_byte"
                            value={formData.free_byte}
                            onChange={handleInputChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="0"
                            required
                        />
                    </div>
                    {/* Surcharge_Unit */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="surcharge_unit"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            Surcharge Unit
                        </label>
                        <input
                            type="number"
                            id="surcharge_unit"
                            value={formData.surcharge_unit}
                            onChange={handleInputChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="0"
                            required
                        />
                    </div>
                    {/* Each_Surcharge_Fee */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="each_surcharge_fee"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            Each Surcharge Fee
                        </label>
                        <input
                            type="number"
                            id="each_surcharge_fee"
                            value={formData.each_surcharge_fee}
                            onChange={handleInputChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="0.0"
                            required
                        />
                    </div>
                    {/* Apply_Company */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="apply_company"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            Apply Company
                        </label>
                        <input
                            type="text"
                            id="apply_company"
                            value={formData.apply_company}
                            onChange={handleInputChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="코리아오브컴"
                            required
                        />
                    </div>
                    {/* Remarks */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="remarks"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            Remarks
                        </label>
                        <input
                            type="text"
                            id="remarks"
                            value={formData.remarks}
                            onChange={handleInputChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="비고"
                            required
                        />
                    </div>
                    {/* Note */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="note"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            Note
                        </label>
                        <input
                            type="text"
                            id="note"
                            value={formData.note}
                            onChange={handleInputChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="메모"
                            required
                        />
                    </div>

                    <button type="submit"
                            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit
                    </button>
                    <button type="button"
                            onClick={() => navigate("/price")}
                            className="ml-4 text-gray-700 bg-gray-300 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800">Cancel
                    </button>

                    {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
                </form>
            </div>
        </>
    );
};
export default PriceNewPage;