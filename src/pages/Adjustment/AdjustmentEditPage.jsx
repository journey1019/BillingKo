import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { updateAdjustment, fetchAdjustmentPart } from '@/service/adjustmentService.js';
import { IoMdClose } from 'react-icons/io';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import useAdjustmentMappings from '@/hooks/useAdjustmentMappings.js';
import { Switch } from "@mui/material";

const AdjustmentEditPage = () => {
    const { adjustment_index } = useParams();
    const navigate = useNavigate();
    const codeMappings = useAdjustmentMappings();
    const [searchParams] = useSearchParams();
    // ✅ URL에서 전달된 인자 추출
    const adjustment_code = searchParams.get("adjustment_code") || "";
    const adjustment_code_value = searchParams.get("adjustment_code_value") || "";
    console.log('adjustment_code: ', adjustment_code, 'adjustment_code_value: ', adjustment_code_value);
ㅁ
    const [formData, setFormData] = useState({
        adjustment_code: adjustment_code || "",
        adjustment_code_value: adjustment_code_value || "",
        adjustment_category: "subscribe",
        adjustment_type: "discount",
        mount_type: "pay",
        mount_value: "",
        description: "",
        adjustment_cycle: "once",
        date_index: "",
        use_yn: "Y",
        tax_free_yn: "Y"
    });
    console.log(codeMappings);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadAdjustmentData = async () => {
            try {
                const adjustment = await fetchAdjustmentPart(adjustment_index);

                setFormData(prev => ({
                    ...prev,
                    ...adjustment,  // 기존 값을 유지하면서 새로운 데이터 덮어쓰기

                    mount_value: adjustment.mount_value ? adjustment.mount_value.toString() : "", // 숫자 → 문자열 변환 (천 단위 표시)
                }));
            } catch (err) {
                setError("조정 데이터를 불러오는 데 실패했습니다.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadAdjustmentData();
    }, [adjustment_index]);

    const formatNumberWithCommas = (value) => {
        if (!value || isNaN(value)) return ""; // 값이 없거나 숫자가 아니면 빈 문자열 반환
        return Number(value).toLocaleString(); // 숫자로 변환 후 천 단위 구분
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        let formattedValue = value;
        if (name === "mount_value") {
            formattedValue = value.replace(/[^0-9]/g, ""); // 숫자만 유지
        }

        setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedData = {
            ...formData,
            mount_value: typeof formData.mount_value === "string"
                ? Number(formData.mount_value.replace(/,/g, "")) // 문자열이라면 ',' 제거 후 숫자로 변환
                : Number(formData.mount_value) // 숫자라면 그대로 변환
            // mount_value: Number(formData.mount_value.replace(/,/g, "")), // 저장할 때 숫자로 변환
        };

        try {
            console.log("PUT 요청 보낼 데이터", formattedData);
            await updateAdjustment(adjustment_index, formattedData);
            alert("조정 데이터를 성공적으로 업데이트 했습니다.");
            navigate("/adjustment");
        } catch (err) {
            console.error(err.message);
            setError("조정 데이터 업데이트에 실패했습니다.");
        }
    };

    // ✅ Yes / No 토글
    const handleToggleChange = () => {
        setFormData((prev) => ({ ...prev, use_yn: prev.use_yn === 'Y' ? 'N' : 'Y' }));
    };
    const handleToggleTaxChange = () => {
        setFormData((prev) => ({ ...prev, tax_free_yn: prev.tax_free_yn === 'Y' ? 'N' : 'Y' }));
    };


    if (loading) return <LoadingSpinner />;
    if (error) return <p className="text-red-500 text-sm mt-3">{error}</p>;

    return (
        <div className="container mx-auto">
            {/* 🔹 Header */}
            <div className="flex flex-row justify-between mb-3">
                <h1 className="py-1 text-lg font-bold">조정 데이터 수정</h1>
                <button onClick={() => navigate('/adjustment')}
                        className="p-2 text-xl text-gray-600 hover:text-gray-900 transition">
                    <IoMdClose />
                </button>
            </div>

            {/* 🔹 Form */}
            <form className="bg-white p-5 rounded-xl space-y-6" onSubmit={handleSubmit}>

                {/* 사용여부 스위치 */}
                <div className="grid grid-cols-6 flex items-center space-x-4">
                    <label className="col-span-2 w-32 text-sm font-medium text-gray-900">사용 여부 *</label>
                    <div className="col-span-4">
                        <Switch checked={formData.use_yn === 'Y'} onChange={handleToggleChange} />
                        <span className="text-sm text-gray-700">{formData.use_yn === 'Y' ? 'Yes' : 'No'}</span>
                    </div>
                </div>

                {/* 임시 조정 스위치 */}
                <div className="grid grid-cols-6 flex items-center space-x-4">
                    <label className="col-span-2 w-32 text-sm font-medium text-gray-900">부가세 포함 여부 *</label>
                    <div className="col-span-4">
                        <Switch checked={formData.tax_free_yn === 'Y'} onChange={handleToggleTaxChange} />
                        <span className="text-sm text-gray-700">{formData.tax_free_yn === 'Y' ? 'Yes' : 'No'}</span>
                    </div>
                </div>

                {/* ✅ 수정 불가능한 필드 */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="adjustment_code" className="col-span-2 text-sm font-medium text-gray-900">조정 대상
                        구분</label>
                    <input type="text" id="adjustment_code" name="adjustment_code"
                           value={codeMappings.adjustment_code[formData.adjustment_code]}
                           className="col-span-4 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                           readOnly />
                </div>

                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="adjustment_code_value" className="col-span-2 text-sm font-medium text-gray-900">조정
                        대상</label>
                    <input type="text" id="adjustment_code_value" name="adjustment_code_value"
                           value={formData.adjustment_code_value}
                           className="col-span-4 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                           readOnly />
                </div>

                {/* ✅ 선택 필드 */}
                {[
                    {
                        id: "adjustment_category",
                        label: "조정 종류",
                        mappingKey: "adjustment_category"
                    },
                    {
                        id: "adjustment_type",
                        label: "가산/할인 여부",
                        mappingKey: "adjustment_type"
                    },
                    {
                        id: "mount_type",
                        label: "지불 방법",
                        mappingKey: "mount_type"
                    },
                    {
                        id: "adjustment_cycle",
                        label: "조정 적용 기간",
                        mappingKey: "adjustment_cycle"
                    }
                ].map(({ id, label, mappingKey }) => (
                    <div key={id} className="grid grid-cols-6 items-center space-x-4">
                        <label htmlFor={id} className="col-span-2 text-sm font-medium text-gray-900">{label}</label>
                        <select id={id} name={id} value={formData[id]} onChange={handleChange}
                                className="col-span-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5">
                            {Object.keys(codeMappings[mappingKey]).map((optionKey, index) => (
                                <option key={optionKey} value={optionKey}>
                                    {Object.values(codeMappings[mappingKey])[index]} {/* 실제 표시되는 값 */}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}

                {/* ✅ 입력 필드 */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="mount_value" className="col-span-2 text-sm font-medium text-gray-900">금액</label>
                    <input
                        type="text" // ✅ input type을 text로 변경하여 문자열로 천 단위 표시
                        id="mount_value"
                        name="mount_value"
                        value={formatNumberWithCommas(formData.mount_value)} // ✅ 표시될 때는 천 단위 구분 추가
                        onChange={handleChange}
                        className="col-span-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 text-right"
                        required
                    />
                </div>

                {/* ✅ Date Index */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="date_index" className="col-span-2 text-sm font-medium text-gray-900">적용 날짜</label>
                    <input
                        type="month"
                        id="date_index"
                        name="date_index"
                        value={
                        formData.date_index && formData.date_index.length === 6
                            ? `${formData.date_index.slice(0, 4)}-${formData.date_index.slice(4, 6)}`
                            : ''
                    }
                        onChange={(e) => {
                            const selectedDate = e.target.value.replace("-", ""); // YYYY-MM → YYYYMM 변환
                            setFormData((prev) => ({ ...prev, date_index: selectedDate }));
                        }}
                        className="col-span-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                        required
                    />
                </div>


                {/* ✅ 설명 */}
                <div className="grid grid-cols-6 items-center space-x-4">
                    <label htmlFor="description" className="col-span-2 text-sm font-medium text-gray-900">설명</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange}
                              className="col-span-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"></textarea>
                </div>

                {/* ✅ 버튼 */}
                <div className="flex space-x-4">
                    <button type="submit"
                            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                        저장
                    </button>
                    <button type="button" onClick={() => navigate("/adjustment")}
                            className="text-gray-700 bg-gray-300 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                        취소
                    </button>
                </div>

                {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
            </form>
        </div>
    );
};

export default AdjustmentEditPage;