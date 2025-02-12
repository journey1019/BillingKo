import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateAdjustment, fetchAdjustmentPart } from '@/service/adjustmentService.js';

import { IoMdClose } from 'react-icons/io';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';

const AdjustmentEditPage = () => {
    const { adjustment_index } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        adjustment_code: "",
        adjustment_code_value: "",
        adjustment_category: "",
        adjustment_type: "",
        mount_type: "",
        mount_value: "",
        description: "",
        adjustment_cycle: "",
        date_index: "",
        use_yn: ""
    });
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPriceData = async () => {
            try {
                const adjustment = await fetchAdjustmentPart(adjustment_index);
                setFormData(adjustment);  // 가져온 데이터를 폼에 채우기
            } catch (err) {
                setError("Failed to fetch price data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadPriceData();
    }, [adjustment_index]);
    console.log(formData)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleToggle = () => {
        setFormData((prev) => ({
            ...prev,
            use_yn: prev.use_yn === "Y" ? "N" : "Y",
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("PUT 요청 보낼 데이터", formData);
            await updateAdjustment(adjustment_index, formData);
            alert("Price updated successfully!");
            navigate("/adjustment");
        } catch (err) {
            console.error(err.message);
            setError("Failed to update price");
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
                    <h1 className="py-1 text-lg font-bold">Price Edit Data</h1>

                    {/* Close */}
                    <button onClick={() => navigate('/adjustment')}
                            className="flex flex-row items-center p-2 text-xl text-gray-600 hover:text-gray-900 transition">
                        <IoMdClose />
                    </button>
                </div>


                {/* Input Form Contents */}
                <form className="bg-white p-5 rounded-xl space-y-6"
                      onSubmit={handleSubmit}
                >
                    {/* Adjustment Code */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="adjustment_code" className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate">
                            Adjustment Code
                        </label>
                        <input
                            type="text"
                            id="adjustment_code"
                            name="adjustment_code"
                            value={formData.adjustment_code}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                            required
                        />
                    </div>

                    {/* Adjustment Code Value */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="adjustment_code_value" className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate">
                            Adjustment Code Value
                        </label>
                        <input
                            type="text"
                            id="adjustment_code_value"
                            name="adjustment_code_value"
                            value={formData.adjustment_code_value}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                            required
                        />
                    </div>

                    {/* Adjustment Category */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="adjustment_category" className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate">
                            Adjustment Category
                        </label>
                        <input
                            type="text"
                            id="adjustment_category"
                            name="adjustment_category"
                            value={formData.adjustment_category}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                            required
                        />
                    </div>

                    {/* Adjustment Type */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="adjustment_type" className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate">
                            Adjustment Type
                        </label>
                        <input
                            type="text"
                            id="adjustment_type"
                            name="adjustment_type"
                            value={formData.adjustment_type}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                            required
                        />
                    </div>

                    {/* Mount Type */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="mount_type" className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate">
                            Mount Type
                        </label>
                        <input
                            type="text"
                            id="mount_type"
                            name="mount_type"
                            value={formData.mount_type}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                            required
                        />
                    </div>

                    {/* Mount Value */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="mount_value" className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate">
                            Mount Value
                        </label>
                        <input
                            type="number"
                            id="mount_value"
                            name="mount_value"
                            value={formData.mount_value}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="description" className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="col-span-4 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                        />
                    </div>

                    {/* Adjustment Cycle (Dropdown) */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor="adjustment_cycle" className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate">
                            Adjustment Cycle
                        </label>
                        <select
                            id="adjustment_cycle"
                            name="adjustment_cycle"
                            value={formData.adjustment_cycle}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                        >
                            <option value="once">Once</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>

                    {/* 사용 여부 (토글 버튼) */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate">
                            사용 여부
                        </label>
                        <div className="col-span-2 flex items-center space-x-4">
                            <div
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    formData.use_yn === "Y" ? "bg-blue-500" : "bg-gray-400"
                                }`}
                                onClick={handleToggle}
                            >
                                <div
                                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                                        formData.use_yn === "Y" ? "translate-x-6" : "translate-x-1"
                                    }`}
                                />
                            </div>
                            <span className="text-sm">{formData.use_yn === "Y" ? "Yes" : "No"}</span>
                        </div>
                    </div>


                    <button type="submit"
                            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit
                    </button>
                    <button type="button"
                            onClick={() => navigate("/adjustment")}
                            className="ml-4 text-gray-700 bg-gray-300 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800">Cancel
                    </button>

                    {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
                </form>
            </div>
        </>
    );
};

export default AdjustmentEditPage;
