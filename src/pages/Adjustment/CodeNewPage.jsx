import { useEffect, useState } from 'react';
import useApiFetch from '@/hooks/useApiFetch.js';
import { fetchCode, createCode } from '@/service/codeService.js';
import ReusableTable from '@/components/table/ReusableTable.jsx';
import { CodeTableColumns } from '@/columns/CodeTableColumns.jsx';
import { createAdjustment } from '@/service/adjustmentService.js';
import { useNavigate } from 'react-router-dom';


const CodeNewPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        code_name: "",
        code_type: "",
        code_value: "",
        code_alias: ""
    });
    const [error, setError] = useState(null);

    // 폼 입력 값 변경 핸들러
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateFormData();
        if (validationError) {
            setError(validationError);
            return;
        }

        const confirmMessage = `
            Please confirm the following details:
            Code Name: ${formData.code_name}
            Code Type: ${formData.code_type}
            Code Value: ${formData.code_value}
            Code Alias: ${formData.code_alias}
        `;

        if (!window.confirm(confirmMessage)) {
            return;
        }

        try {
            await createCode(formData);
            alert("Account successfully created.");
            navigate(0);  // ✅ 현재 페이지(`/code/new`)를 리프레시
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to create account.");
        }
    }

    const validateFormData = () => {
        for (const key in formData) {
            if (!formData[key]) {
                return `The field "${key}" is required.`;
            }
        }
        return null;
    };

    return(
        <>
            <div className="grid gap-0 grid-cols-6">
                <div className="col-span-6 justify-between border-b pb-3 mb-2 border-gray-400">
                    <h1 className="text-2xl font-base">New Code Table</h1>
                </div>

                <div className="col-span-6">

                    <form className="bg-white p-5 rounded-xl space-y-6"
                          onSubmit={handleSubmit}
                    >

                        {/* Code Name */}
                        <div className="grid grid-cols-3 items-center gap-4">
                            <label htmlFor="code_name" className="text-sm font-medium text-gray-900">
                                Code Name
                            </label>
                            <input
                                type="text"
                                id="code_name"
                                value={formData.code_name}
                                onChange={handleInputChange}
                                className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                                placeholder="Code Name 입력"
                                required
                            />
                        </div>

                        {/* Code Type */}
                        <div className="grid grid-cols-3 items-center gap-4">
                            <label htmlFor="code_type" className="text-sm font-medium text-gray-900">
                                Code Type
                            </label>
                            <input
                                type="text"
                                id="code_type"
                                value={formData.code_type}
                                onChange={handleInputChange}
                                className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                                placeholder="Code Type 입력"
                                required
                            />
                        </div>

                        {/* Code Value */}
                        <div className="grid grid-cols-3 items-center gap-4">
                            <label htmlFor="code_value" className="text-sm font-medium text-gray-900">
                                Code Value
                            </label>
                            <input
                                type="text"
                                id="code_value"
                                value={formData.code_value}
                                onChange={handleInputChange}
                                className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                                placeholder="Code Value 입력"
                                required
                            />
                        </div>

                        {/* Code Alias */}
                        <div className="grid grid-cols-3 items-center gap-4">
                            <label htmlFor="code_alias" className="text-sm font-medium text-gray-900">
                                Code Alias
                            </label>
                            <input
                                type="text"
                                id="code_alias"
                                value={formData.code_alias}
                                onChange={handleInputChange}
                                className="col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                                placeholder="Code Alias 입력"
                            />
                        </div>

                        <button type="submit"
                                className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit
                        </button>
                        <button type="button"
                                onClick={() => navigate("/code/new")}
                                className="ml-4 text-gray-700 bg-gray-300 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800">Cancel
                        </button>

                        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

                    </form>
                </div>
            </div>
        </>
    )
}

export default CodeNewPage;