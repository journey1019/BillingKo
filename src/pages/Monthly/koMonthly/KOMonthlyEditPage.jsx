import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { saveKOMonthlyDetailData } from "@/service/monthlyService.js";
import LoadingSpinner from "@/components/common/LoadingSpinner.jsx";

const KOMonthlyEditPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const detailData = location.state?.detailData || null;

    const [formData, setFormData] = useState(detailData || {});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // 배열 항목 핸들러 (중첩 데이터)
    const handleArrayChange = (index, field, value, key) => {
        setFormData((prevData) => ({
            ...prevData,
            [key]: prevData[key].map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            ),
        }));
    };

    // 저장 버튼 핸들러
    const handleSave = async () => {
        if (!formData) {
            setError("No data available to save.");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccessMessage("");

        try {
            await saveKOMonthlyDetailData(formData);
            setSuccessMessage("Data saved successfully!");
        } catch (error) {
            setError(error.message || "Failed to save data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-black text-center">Edit Monthly Data</h2>

            {/* 로딩 상태 */}
            {loading && <LoadingSpinner />}
            {/* 에러 메시지 */}
            {error && <p className="text-red-500">{error}</p>}
            {/* 성공 메시지 */}
            {successMessage && <p className="text-green-500">{successMessage}</p>}

            {/* Form */}
            <form className="grid grid-cols-4 gap-4">
                {/* 기본 정보 */}
                {[
                    "data_index",
                    "profile_id",
                    "acct_num",
                    "serial_number",
                    "ppid",
                    "date_index",
                    "user_id",
                    "update_version",
                    "monthly_primary_key"
                ].map((field) => (
                    <div key={field} className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">{field}</label>
                        <input
                            type="text"
                            name={field}
                            value={formData[field] || ""}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            readOnly={["data_index", "monthly_primary_key"].includes(field)}
                        />
                    </div>
                ))}

                {/* 날짜 필드 */}
                {["activate_date", "deactivate_date", "update_date"].map((field) => (
                    <div key={field} className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">{field}</label>
                        <input
                            type="datetime-local"
                            name={field}
                            value={formData[field] ? formData[field].replace("T", " ").slice(0, 16) : ""}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        />
                    </div>
                ))}

                {/* 숫자 필드 */}
                {["free_bytes", "use_byte_total", "use_period", "use_percent_of_month"].map((field) => (
                    <div key={field} className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700">{field}</label>
                        <input
                            type="number"
                            name={field}
                            value={formData[field] || ""}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        />
                    </div>
                ))}

                {/* 배열 데이터 */}
                {formData.use_period_detail && formData.use_period_detail.map((item, index) => (
                    <div key={`use_period_${index}`} className="col-span-4 border p-4 rounded-lg">
                        <h3 className="text-lg font-bold text-gray-700">Use Period Detail {index + 1}</h3>
                        <div className="grid grid-cols-4 gap-4">
                            {["acct_num", "act_date", "deact_date", "deact_profile_id", "use_percent_of_month", "use_period"].map((field) => (
                                <div key={field} className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">{field}</label>
                                    <input
                                        type={field.includes("date") ? "datetime-local" : "text"}
                                        name={field}
                                        value={item[field] || ""}
                                        onChange={(e) => handleArrayChange(index, field, e.target.value, "use_period_detail")}
                                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Payment 정보 */}
                {formData.payment && (
                    <div className="col-span-4 border p-4 rounded-lg">
                        <h3 className="text-lg font-bold text-gray-700">Payment Details</h3>
                        <div className="grid grid-cols-4 gap-4">
                            {["basic_fee", "final_fee", "total_fee", "add_use_fee", "cut_off_fee", "subscribe_fee", "modification_fee"].map((field) => (
                                <div key={field} className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700">{field}</label>
                                    <input
                                        type="number"
                                        name={field}
                                        value={formData.payment[field] || ""}
                                        onChange={(e) => handleArrayChange(0, field, e.target.value, "payment")}
                                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Save & Cancel 버튼 */}
                <div className="col-span-4 flex justify-between mt-4">
                    <button
                        type="button"
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        Save Data
                    </button>
                </div>
            </form>
        </div>
    );
};

export default KOMonthlyEditPage;
