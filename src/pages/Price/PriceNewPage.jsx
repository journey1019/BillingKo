import usePriceStore from '@/stores/priceStore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';
import { renderInputField } from '@/utils/renderHelpers.jsx';
import { usePPIDList } from '@/selectors/usePriceSelectors';
import { defaultPriceFormData } from '@/contents/priceFormDefault.js';
import { formatAnyWithCommas, formatNumber, removeCommas } from '@/utils/formatHelpers.jsx';
import { createPrice } from '@/service/priceService.js';
import { renderStandardInputField } from '@/utils/renderHelpers.jsx';

const PriceNewPage = () => {
    const { fetchPriceData, handleChange, submitPriceForm, } = usePriceStore();
    const navigate = useNavigate();

    const pricePPIDList = usePPIDList(defaultPriceFormData);

    useEffect(() => {
        fetchPriceData();
    }, []);

    const [formData, setFormData] = useState(defaultPriceFormData);

    const [error, setError] = useState("");
    const [ppidError, setPpidError] = useState("");

    const handleInputChange = (e) => {
        const { id, value } = e.target;

        let cleanedValue = value;

        if (["basic_fee", "subscription_fee", "free_byte", "surcharge_unit", "each_surcharge_fee"].includes(id)) {
            cleanedValue = value.replace(/[^0-9]/g, "");
        }

        if (id === "ppid") {
            const isDuplicate = pricePPIDList.map(String).includes(String(value).trim());
            setPpidError(isDuplicate ? "이미 존재하는 PPID 입니다." : "");
        }

        setFormData((prev) => ({ ...prev, [id]: cleanedValue }));
    };



    const validateFormData = () => {
        const requiredFields = [
            "ppid",
            "basic_fee",
            "subscription_fee",
            "free_byte",
            "surcharge_unit",
            "each_surcharge_fee",
        ];

        for (const field of requiredFields) {
            if (!formData[field]) {
                console.log(field)
                return `필수 입력 항목: ${field}`;
            }
        }
        return null;
    };


    console.log(formData)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (pricePPIDList.includes(formData.ppid)) {
            setPpidError("이미 존재하는 PPID 번호입니다.");
            return;
        }

        const validationError = validateFormData();
        if (validationError) {
            setError(validationError);
            return;
        }

        // ✅ 숫자형 필드들 변환
        const numericFields = ["ppid", "basic_fee", "subscription_fee", "free_byte", "surcharge_unit", "each_surcharge_fee"];
        const cleanedData = { ...formData };

        numericFields.forEach((field) => {
            cleanedData[field] = Number(String(formData[field]).replace(/[^0-9]/g, ""));
        });

        // ✅ null 또는 빈 문자열 처리
        cleanedData.apply_company = formData.apply_company || "-";
        cleanedData.remarks = formData.remarks || "-";
        cleanedData.note = formData.note || "-";

        try {
            await createPrice(cleanedData); // 👈 변환된 데이터로 요청
            alert("요금이 성공적으로 등록되었습니다.");
            navigate("/price");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container mx-auto">
            <div className="flex flex-row justify-between mb-3">
                <h1 className="py-1 text-lg font-bold">신규 요금 등록</h1>
                <button onClick={() => navigate("/price")}
                        className="p-2 text-xl text-gray-600 hover:text-gray-900 transition">
                    <IoMdClose />
                </button>
            </div>

            <form className="bg-white p-5 rounded-xl space-y-4" onSubmit={handleSubmit}>

                {[
                    { id: "ppid", label: "PPID", type: "text", placeholder: "999", error: ppidError, required: true },
                    { id: "apply_company", label: "적용회사", type: "text", placeholder: "코리아오브컴" },
                    { id: "basic_fee", label: "기본료", type: "text", placeholder: "0", required: true },
                    { id: "subscription_fee", label: "가입비", type: "text", placeholder: "0", required: true },
                    { id: "free_byte", label: "무료 데이터", type: "text", placeholder: "0", required: true },
                    { id: "surcharge_unit", label: "추가 사용 과금 단위", type: "text", placeholder: "0", required: true },
                    { id: "each_surcharge_fee", label: "추가 사용 과금 금액", type: "text", placeholder: "0", required: true },
                    { id: "remarks", label: "비고", type: "text", placeholder: "비고" },
                    { id: "note", label: "메모", type: "text", placeholder: "메모" },
                ].map(({ id, label, type, placeholder, required, errorMessage }) =>
                    renderStandardInputField(
                        id,
                        label,
                        type,
                        formData[id],
                        handleInputChange,
                        null,                         // dataList 없음
                        required,
                        errorMessage,
                        id === "ppid" ? ppidError : "", // ✅ errorMessage 여기서 명시적으로 전달
                        placeholder
                    )
                )}

                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg">
                    저장
                </button>
                {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
            </form>
        </div>
    );
};

export default PriceNewPage;
