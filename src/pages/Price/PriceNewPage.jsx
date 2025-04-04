import usePriceStore from '@/stores/priceStore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';
import { renderInputField } from '@/utils/renderHelpers.jsx';
import { usePPIDList } from '@/selectors/usePriceSelectors';

const fieldLabels = {
    ppid: "PPID",
    basic_fee: "기본료",
    subscription_fee: "가입비",
    free_byte: "무료 데이터",
    surcharge_unit: "추가 사용 과금 단위",
    each_surcharge_fee: "추가 사용 과금 금액",
    apply_company: "적용 회사",
    remarks: "비고",
    note: "메모"
};

const PriceNewPage = () => {
    const navigate = useNavigate();
    const {
        fetchPriceData,
        priceData,
        formData,
        handleChange,
        submitPriceForm,
        ppidError,
        priceError
    } = usePriceStore();
    const pricePPIDList = usePPIDList();


    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPriceData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await submitPriceForm();
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
                {renderInputField("ppid", "PPID", "text", formData['ppid'], (e) => handleChange("ppid", e.target.value), true, ppidError, "999")}

                {Object.entries(fieldLabels).map(([id, label]) => {
                    if (id === 'ppid') return null;
                    const type = id.includes("fee") || id.includes("byte") || id.includes("unit") ? 'number' : 'text';
                    const isRequired = !['apply_company', 'remarks', 'note'].includes(id);
                    return renderInputField(
                        id,
                        label,
                        type,
                        formData[id],
                        (e) => handleChange(id, e.target.value), // ✅ 여기 수정!
                        isRequired
                    );
                })}


                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg">
                    저장
                </button>
                {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
            </form>
        </div>
    );
};

export default PriceNewPage;
