import { useState } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createAdjustment } from '@/service/adjustmentService.js';
import { IoMdClose } from 'react-icons/io';
import useAdjustmentMappings from '@/hooks/useAdjustmentMappings.js';
import { Switch } from "@mui/material";

const AdjustmentNewPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams(); // ✅ Query Params 가져오기
    const codeMappings = useAdjustmentMappings();

    // ✅ URL에서 전달된 인자 추출
    const adjustment_code = searchParams.get("adjustment_code") || "";
    const adjustment_code_value = searchParams.get("adjustment_code_value") || "";
    console.log('adjustment_code: ', adjustment_code, 'adjustment_code_value: ', adjustment_code_value)

    const [formData, setFormData] = useState({
        adjustment_code: adjustment_code || "account_num",
        adjustment_code_value: adjustment_code_value || "",
        adjustment_category: "subscribe",
        adjustment_type: "discount",
        mount_type: "pay",
        mount_value: "",
        description: "",
        adjustment_cycle: "once",
        date_index: "202501",
        use_yn: "Y",
        tax_free_yn: "Y"
    });

    const [error, setError] = useState(null);

    const formatNumberWithCommas = (value) => {
        if (!value || isNaN(value)) return "";
        return Number(value).toLocaleString();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        let formattedValue = value;
        if (name === "mount_value") {
            formattedValue = value.replace(/[^0-9]/g, "");
        }

        setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    };

    const handleToggleChange = () => {
        setFormData((prev) => ({ ...prev, use_yn: prev.use_yn === 'Y' ? 'N' : 'Y' }));
    };

    const handleToggleTaxChange = () => {
        setFormData((prev) => ({ ...prev, tax_free_yn: prev.tax_free_yn === 'Y' ? 'N' : 'Y' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validatedData = {
            ...formData,
            mount_value: Number(formData.mount_value.replace(/,/g, "")), // 숫자로 변환
            description: formData.description.trim() === "" ? "" : formData.description,
        };

        try {
            console.log("POST 요청 보낼 데이터", validatedData);
            await createAdjustment(validatedData);
            alert("조정 데이터를 성공적으로 생성했습니다.");
            navigate("/adjustment");
        } catch (err) {
            console.error(err.message);
            setError("조정 데이터 생성에 실패했습니다.");
        }
    };

    return (
        <div className="container mx-auto">
            {/* 🔹 Header */}
            <div className="flex flex-row justify-between mb-3">
                <h1 className="py-1 text-lg font-bold">조정 데이터 생성</h1>
                <button onClick={() => navigate('/adjustment')}
                        className="p-2 text-xl text-gray-600 hover:text-gray-900 transition">
                    <IoMdClose />
                </button>
            </div>

            {/* 🔹 Form */}
            <form className="bg-white p-5 rounded-xl space-y-6" onSubmit={handleSubmit}>

                {/* 사용 여부 스위치 */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label className="col-span-2 text-sm font-medium text-gray-900">사용 여부 *</label>
                    <div className="col-span-4">
                        <Switch checked={formData.use_yn === 'Y'} onChange={handleToggleChange} />
                        <span className="text-sm text-gray-700">{formData.use_yn === 'Y' ? 'Yes' : 'No'}</span>
                    </div>
                </div>

                {/* 부가세 포함 여부 */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label className="col-span-2 text-sm font-medium text-gray-900">부가세 포함 여부 *</label>
                    <div className="col-span-4">
                        <Switch checked={formData.tax_free_yn === 'Y'} onChange={handleToggleTaxChange} />
                        <span className="text-sm text-gray-700">{formData.tax_free_yn === 'Y' ? 'Yes' : 'No'}</span>
                    </div>
                </div>

                {/* ✅ 입력 필드 */}
                {/*{[*/}
                {/*    { id: "adjustment_code", label: "조정 대상 구분", placeholder: "Serial Number" },*/}
                {/*    { id: "adjustment_code_value", label: "조정 대상", placeholder: "01680651SKYD374" },*/}
                {/*].map(({ id, label, placeholder }) => (*/}
                {/*    <div key={id} className="grid grid-cols-6 items-center space-x-4">*/}
                {/*        <label htmlFor={id} className="col-span-2 text-sm font-medium text-gray-900">{label}</label>*/}
                {/*        <input type="text" id={id} name={id} value={formData[id]} onChange={handleChange}*/}
                {/*               className="col-span-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"*/}
                {/*               placeholder={placeholder} required />*/}
                {/*    </div>*/}
                {/*))}*/}

                {/* ✅ 조정 대상 구분 */}
                <div key="adjustment_code" className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="adjustment_code" className="col-span-2 text-sm font-medium text-gray-900">조정 대상
                        구분</label>
                    <select id="adjustment_code" name="adjustment_code" value={formData.adjustment_code}
                            onChange={handleChange}
                            className="col-span-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5">
                        {Object.keys(codeMappings["adjustment_code"]).map((optionKey, index) => (
                            <option key={optionKey} value={optionKey}>
                                {Object.values(codeMappings["adjustment_code"])[index]}
                            </option>
                        ))}
                    </select>
                </div>

                {/* ✅ 조정 대상 */}
                <div key="adjustment_code_value" className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="adjustment_code_value" className="col-span-2 text-sm font-medium text-gray-900">조정
                        대상</label>
                    <input type="text" id="adjustment_code_value" name="adjustment_code_value"
                           value={formData.adjustment_code_value} onChange={handleChange}
                           className="col-span-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                           placeholder="01680651SKYD374" required />
                </div>

                {/* ✅ 선택 필드 */}
                {[
                    { id: 'adjustment_category', label: '조정 종류', mappingKey: "adjustment_category" },
                    { id: "adjustment_type", label: "가산/할인 여부", mappingKey: "adjustment_type" },
                    { id: "mount_type", label: "지불 방법", mappingKey: "mount_type" },
                    { id: "adjustment_cycle", label: "조정 적용 기간", mappingKey: "adjustment_cycle" },
                ].map(({ id, label, mappingKey }) => (
                    <div key={id} className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor={id} className="col-span-2 text-sm font-medium text-gray-900">{label}</label>
                        <select id={id} name={id} value={formData[id]} onChange={handleChange}
                                className="col-span-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5">
                            {Object.keys(codeMappings[mappingKey]).map((optionKey, index) => (
                                <option key={optionKey} value={optionKey}>
                                    {Object.values(codeMappings[mappingKey])[index]}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}

                {/* ✅ 금액 입력 */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="mount_value" className="col-span-2 text-sm font-medium text-gray-900">금액</label>
                    <input type="text" id="mount_value" name="mount_value"
                           value={formatNumberWithCommas(formData.mount_value)}
                           onChange={handleChange}
                           placeholder="0"
                           className="col-span-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 text-right"
                           required />
                </div>

                {/* ✅ 날짜 입력 */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="date_index" className="col-span-2 text-sm font-medium text-gray-900">날짜</label>
                    <input
                        type="month"
                        id="date_index"
                        name="date_index"
                        value={formData.date_index ? `${formData.date_index.slice(0, 4)}-${formData.date_index.slice(4, 6)}` : ""}
                        onChange={(e) => {
                            const selectedDate = e.target.value.replace("-", ""); // YYYY-MM → YYYYMM
                            setFormData((prev) => ({ ...prev, date_index: selectedDate }));
                        }}
                        className="col-span-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                        required
                    />
                </div>


                {/* ✅ 설명 입력 */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="description" className="col-span-2 text-sm font-medium text-gray-900">설명</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange}
                              placeholder="메모"
                              className="col-span-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"></textarea>
                </div>

                {/* ✅ 버튼 */}
                <div className="flex space-x-4">
                    <button type="submit"
                            className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5">
                        저장
                    </button>
                    <button type="button" onClick={() => navigate("/adjustment")}
                            className="text-gray-700 bg-gray-300 hover:bg-gray-400 font-medium rounded-lg text-sm px-5 py-2.5">
                        취소
                    </button>
                </div>

                {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
            </form>
        </div>
    );
};

export default AdjustmentNewPage;
