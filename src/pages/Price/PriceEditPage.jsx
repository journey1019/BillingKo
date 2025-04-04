import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updatePrice, fetchPricePart } from "@/service/priceService.js";

import { IoMdClose } from 'react-icons/io';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import { formatAnyWithCommas, removeCommas } from '@/utils/formatHelpers.jsx';

import { renderStandardInputField } from '@/utils/renderHelpers'

const PriceEditPage = () => {
    const { ppid } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
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

    useEffect(() => {
        const loadPriceData = async () => {
            try {
                const price = await fetchPricePart(ppid);
                setFormData({
                    ...price,
                    basic_fee: formatAnyWithCommas(price.basic_fee),
                    subscription_fee: formatAnyWithCommas(price.subscription_fee),
                    free_byte: formatAnyWithCommas(price.free_byte),
                    surcharge_unit: formatAnyWithCommas(price.surcharge_unit),
                    each_surcharge_fee: formatAnyWithCommas(price.each_surcharge_fee),
                })
                console.log(formData)
            } catch (err) {
                setError("Failed to fetch price data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadPriceData();
    }, [ppid]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // 숫자 필드일 경우 천 단위 구분자 적용
        const numericFields = ["basic_fee", "subscription_fee", "free_byte", "surcharge_unit", "each_surcharge_fee"];

        if (numericFields.includes(name)) {
            // 입력 값에서 , 제거하고 숫자 → 다시 천 단위로 포맷
            const cleaned = removeCommas(value);
            formattedValue = formatAnyWithCommas(cleaned);
        }

        setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            basic_fee: removeCommas(formData.basic_fee),
            subscription_fee: removeCommas(formData.subscription_fee),
            free_byte: removeCommas(formData.free_byte),
            surcharge_unit: removeCommas(formData.surcharge_unit),
            each_surcharge_fee: removeCommas(formData.each_surcharge_fee),
        };
        // console.log("PUT 요청 보내기 직전 데이터", formData);
        try {
            // console.log("PUT 요청 보낼 데이터", payload);
            await updatePrice(ppid, payload);
            alert("Price updated successfully!");
            navigate("/price");
        } catch (err) {
            // console.error(err.message);
            setError("Failed to update price");
        }
    };

    if (loading) return <LoadingSpinner/>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <div className="container mx-auto">
                {/* Top */}
                <div className="flex flex-row justify-between mb-3">
                    {/* Title */}
                    <h1 className="py-1 text-lg font-bold">Price Edit Data</h1>

                    {/* Close */}
                    <button onClick={() => navigate('/price')}
                            className="flex flex-row items-center p-2 text-xl text-gray-600 hover:text-gray-900 transition">
                        <IoMdClose />
                    </button>
                </div>

                {/* Input Form Contents */}
                <form className="bg-white p-5 rounded-xl space-y-6" onSubmit={handleSubmit}>

                    {[
                        { id: 'ppid', label: 'PPID', type: 'number', placeholder: 999, required: true, readOnly: true },
                        { id: 'basic_fee', label: '기본료', type: 'text', placeholder: '0', required: true },
                        { id: 'subscription_fee', label: '가입비', type: 'text', placeholder: '0', required: true },
                        { id: 'surcharge_unit', label: '추가 사용 과금 단위', type: 'text', min: 0, max: 100, step: 0.1, placeholder: '1.0', required: true },
                        { id: 'each_surcharge_fee', label: '추가 사용 과금 금액', type: 'text', required: true },
                        { id: 'apply_company', label: '적용 회사', type: 'text', placeholder: '코리아오브컴', required: true },
                        { id: 'remarks', label: '비고', type: 'text', placeholder: '비고' },
                        { id: 'note', label: '메모', type: 'text', placeholder: '메모' },
                    ].map(({ id, label, type, dataList, placeholder, required, readOnly }) =>
                        renderStandardInputField(
                            id,
                            label,
                            type,
                            formData[id],
                            handleChange,
                            dataList,
                            required,
                            readOnly || false,
                            "", // 에러 메시지 있으면 여기에
                            placeholder
                        )
                    )}

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

export default PriceEditPage;
