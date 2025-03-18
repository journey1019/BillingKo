import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updatePrice, fetchPricePart } from "@/service/priceService.js";

import { IoMdClose } from 'react-icons/io';
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';
import { formatNumber } from '../../utils/formatHelpers.jsx';

const PriceEditPage = () => {
    const { ppid } = useParams();
    const navigate = useNavigate();
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
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPriceData = async () => {
            try {
                const price = await fetchPricePart(ppid);

                // 숫자 필드에 대해서 천 단위 포맷 적용
                const formattedPrice = {
                    ...price,
                    basic_fee: price.basic_fee ? Number(price.basic_fee).toLocaleString() : "",
                    subscription_fee: price.subscription_fee ? Number(price.subscription_fee).toLocaleString() : "",
                    free_byte: price.free_byte ? Number(price.free_byte).toLocaleString() : "",
                    surcharge_unit: price.surcharge_unit ? Number(price.surcharge_unit).toLocaleString() : "",
                    each_surcharge_fee: price.each_surcharge_fee ? Number(price.each_surcharge_fee).toLocaleString() : "",
                };

                setFormData(formattedPrice);
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

        // 숫자 필드일 경우 천 단위 구분자 적용
        const numericFields = ["basic_fee", "subscription_fee", "free_byte", "surcharge_unit", "each_surcharge_fee"];

        let formattedValue = value;
        if (numericFields.includes(name)) {
            // 숫자만 남기기
            const onlyNums = value.replace(/[^0-9]/g, "");
            formattedValue = onlyNums ? Number(onlyNums).toLocaleString() : "";
        }

        setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("PUT 요청 보낼 데이터", formData);
            await updatePrice(ppid, formData);
            alert("Price updated successfully!");
            navigate("/price");
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
                    <button onClick={() => navigate('/price')}
                            className="flex flex-row items-center p-2 text-xl text-gray-600 hover:text-gray-900 transition">
                        <IoMdClose />
                    </button>
                </div>


                {/* Input Form Contents */}
                <form className="bg-white p-5 rounded-xl space-y-6"
                      onSubmit={handleSubmit}
                >
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
                            name="ppid"
                            value={formData.ppid}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            readOnly // 수정 불가 설정(기본키가 변경되면 백에서 기존 데이터를 찾지 못하고 새롭게 생성하게 됨)
                            placeholder="999"
                        />
                    </div>
                    {/* Basic_Fee */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="basic_fee"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            기본료
                        </label>
                        <input
                            type="text"
                            id="basic_fee"
                            name="basic_fee"
                            value={formData.basic_fee}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 text-right"
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
                            가입비
                        </label>
                        <input
                            type="text"
                            id="subscription_fee"
                            name="subscription_fee"
                            value={formData.subscription_fee}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 text-right"
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
                            추가 사용 과금 단위
                        </label>
                        <input
                            type="text"
                            id="surcharge_unit"
                            name="surcharge_unit"
                            value={formData.surcharge_unit}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 text-right"
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
                            추가 사용 과금 금액
                        </label>
                        <input
                            type="text"
                            id="each_surcharge_fee"
                            name="each_surcharge_fee"
                            value={formData.each_surcharge_fee}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 text-right"
                            placeholder="0"
                            required
                        />
                    </div>
                    {/* Apply_Company */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="apply_company"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            고객
                        </label>
                        <input
                            type="text"
                            id="apply_company"
                            name="apply_company"
                            value={formData.apply_company}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                            placeholder="0"
                            required
                        />
                    </div>
                    {/* Remarks */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="remarks"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            비고
                        </label>
                        <input
                            type="text"
                            id="remarks"
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="비고"
                        />
                    </div>
                    {/* Note */}
                    <div className="grid grid-cols-6 items-center space-x-4">
                        <label
                            htmlFor="note"
                            className="col-start-1 col-end-1 text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                            메모
                        </label>
                        <input
                            type="text"
                            id="note"
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                            className="col-span-2 col-start-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="메모"
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

export default PriceEditPage;
