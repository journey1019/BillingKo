import { useState } from "react";
import { createAdjustment } from '@/service/adjustmentService.js';
import { useNavigate } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';


const AdjustmentNewPage = () => {
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

    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({...formData, [id]: value });
    }

    const validateFormData = () => {
        const requiredFields = [
            "adjustment_code",
            "adjustment_code_value",
            "adjustment_category",
            "adjustment_type",
            "mount_type",
            "mount_value",
            "adjustment_cycle",
            "date_index",
            "use_yn",
        ]; // ✅ `description`을 필수 필드에서 제외

        for (const key of requiredFields) {
            if (!formData[key]) {
                return `The field "${key}" is required.`;
            }
        }
        return null;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateFormData();
        if (validationError) {
            setError(validationError);
            return;
        }

        // description이 비어 있으면 null로 설정
        const submissionData = {
            ...formData,
            description: formData.description.trim() === "" ? null : formData.description,
        };

        const confirmMessage = `
            Please confirm the following details:
            Adjustment Code: ${submissionData.adjustment_code}
            Adjustment Code Value: ${submissionData.adjustment_code_value}
            Adjustment Category: ${submissionData.adjustment_category}
            Adjustment Type: ${submissionData.adjustment_type}
            Mount Type: ${submissionData.mount_type}
            Mount Value: ${submissionData.mount_value}
            Description: ${submissionData.description || "N/A"}
            Adjustment Cycle: ${submissionData.adjustment_cycle}
            Date Index: ${submissionData.date_index}
            Use: ${submissionData.use_yn}
        `;

        if (!window.confirm(confirmMessage)) {
            return;
        }

        try {
            await createAdjustment(submissionData);
            alert("Adjustment successfully created.");
            navigate("/adjustment");
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to create adjustment.");
        }
    }

    return(
        <>
            <div className="container mx-auto">
                <div className="flex flex-row justify-between mb-3">
                    {/* Title */}
                    <h1 className="py-1 text-lg font-bold">Adjustment New Data</h1>

                    {/* 페이지 이동 */}
                    <button onClick={() => navigate('/adjustment')}
                            className="flex flex-row items-center p-2 text-xl text-gray-600 hover:text-gray-900 transition">
                        <IoMdClose />
                    </button>
                </div>

                <form className="bg-white p-5 rounded-xl space-y-6"
                      onSubmit={handleSubmit}
                >
                    {/* Adjustment Code */}
                    <div className="grid grid-cols-6 items-center gap-4">
                        <label htmlFor="adjustment_code" className="text-sm font-medium text-gray-900">
                            조정 코드
                        </label>
                        <input
                            type="text"
                            id="adjustment_code"
                            value={formData.adjustment_code}
                            onChange={handleInputChange}
                            className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                            placeholder="코드 입력"
                            required
                        />
                    </div>

                    {/* Adjustment Code Value */}
                    <div className="grid grid-cols-6 items-center gap-4">
                        <label htmlFor="adjustment_code_value" className="text-sm font-medium text-gray-900">
                            조정 코드 값
                        </label>
                        <input
                            type="text"
                            id="adjustment_code_value"
                            value={formData.adjustment_code_value}
                            onChange={handleInputChange}
                            className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                            placeholder="값 입력"
                            required
                        />
                    </div>

                    {/* Adjustment Category */}
                    <div className="grid grid-cols-6 items-center gap-4">
                        <label htmlFor="adjustment_category" className="text-sm font-medium text-gray-900">
                            조정 카테고리
                        </label>
                        <input
                            type="text"
                            id="adjustment_category"
                            value={formData.adjustment_category}
                            onChange={handleInputChange}
                            className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                            placeholder="카테고리 입력"
                            required
                        />
                    </div>

                    {/* Adjustment Type */}
                    <div className="grid grid-cols-6 items-center gap-4">
                        <label htmlFor="adjustment_type" className="text-sm font-medium text-gray-900">
                            조정 타입
                        </label>
                        <input
                            type="text"
                            id="adjustment_type"
                            value={formData.adjustment_type}
                            onChange={handleInputChange}
                            className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                            placeholder="타입 입력"
                            required
                        />
                    </div>

                    {/* Mount Type */}
                    <div className="grid grid-cols-6 items-center gap-4">
                        <label htmlFor="mount_type" className="text-sm font-medium text-gray-900">
                            마운트 타입
                        </label>
                        <input
                            type="text"
                            id="mount_type"
                            value={formData.mount_type}
                            onChange={handleInputChange}
                            className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                            placeholder="마운트 타입 입력"
                            required
                        />
                    </div>

                    {/* Mount Value */}
                    <div className="grid grid-cols-6 items-center gap-4">
                        <label htmlFor="mount_value" className="text-sm font-medium text-gray-900">
                            마운트 값
                        </label>
                        <input
                            type="text"
                            id="mount_value"
                            value={formData.mount_value}
                            onChange={handleInputChange}
                            className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                            placeholder="값 입력"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="grid grid-cols-6 items-center gap-4">
                        <label htmlFor="description" className="text-sm font-medium text-gray-900">
                            설명
                        </label>
                        <input
                            type="text"
                            id="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                            placeholder="설명 입력"
                        />
                    </div>

                    {/* Adjustment Cycle */}
                    <div className="grid grid-cols-6 items-center gap-4">
                        <label htmlFor="adjustment_cycle" className="text-sm font-medium text-gray-900">
                            조정 주기
                        </label>
                        <select
                            id="adjustment_cycle"
                            value={formData.adjustment_cycle}
                            onChange={handleInputChange}
                            className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                        >
                            <option value="">선택하세요</option>
                            <option value="monthly">Monthly</option>
                            <option value="once">Once</option>
                        </select>
                    </div>

                    {/* Date Index */}
                    <div className="grid grid-cols-6 items-center gap-4">
                        <label htmlFor="date_index" className="text-sm font-medium text-gray-900">
                            날짜 인덱스
                        </label>
                        <input
                            type="text"
                            id="date_index"
                            value={formData.date_index}
                            onChange={handleInputChange}
                            className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                            placeholder="YYYYMM"
                        />
                    </div>

                    {/* Use Y/N */}
                    <div className="grid grid-cols-6 items-center gap-4">
                        <label htmlFor="use_yn" className="text-sm font-medium text-gray-900">
                            사용 여부
                        </label>
                        <div className="col-span-2 flex items-center space-x-4">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="use_yn"
                                    checked={formData.use_yn === "Y"}
                                    onChange={(e) =>
                                        handleInputChange({
                                            target: { id: "use_yn", value: e.target.checked ? "Y" : "N" },
                                        })
                                    }
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600"></div>
                                <div className="absolute w-5 h-5 bg-white rounded-full shadow-lg transform peer-checked:translate-x-5 transition-all"></div>
                            </label>
                            <span className="text-sm text-gray-700">
                                    {formData.use_yn === "Y" ? "Yes" : "No"}
                                </span>
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
    )
}

export default AdjustmentNewPage;