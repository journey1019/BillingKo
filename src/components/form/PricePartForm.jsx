import React from 'react';

const PricePartForm = ({ pricePartData }) => {
    return (
        <form className="grid grid-cols-2 gap-6 p-6 bg-white shadow-lg rounded-md">
            {/* Price Plan ID */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Price Plan ID (PPID)</label>
                <input
                    type="number"
                    value={pricePartData.ppid}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>

            {/* Basic Fee */}
            <div>
                <label className="block text-sm font-medium text-gray-700">기본 요금 (Basic Fee)</label>
                <input
                    type="number"
                    value={pricePartData.basic_fee}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>

            {/* Subscription Fee */}
            <div>
                <label className="block text-sm font-medium text-gray-700">구독 요금 (Subscription Fee)</label>
                <input
                    type="number"
                    value={pricePartData.subscription_fee}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>

            {/* Free Byte */}
            <div>
                <label className="block text-sm font-medium text-gray-700">무료 데이터 (Free Byte)</label>
                <input
                    type="number"
                    value={pricePartData.free_byte}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>

            {/* Surcharge Unit */}
            <div>
                <label className="block text-sm font-medium text-gray-700">초과 사용 단위 (Surcharge Unit)</label>
                <input
                    type="number"
                    value={pricePartData.surcharge_unit}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>

            {/* Each Surcharge Fee */}
            <div>
                <label className="block text-sm font-medium text-gray-700">단위별 추가 요금 (Each Surcharge Fee)</label>
                <input
                    type="number"
                    value={pricePartData.each_surcharge_fee}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>

            {/* Apply Company */}
            <div>
                <label className="block text-sm font-medium text-gray-700">적용 회사 (Apply Company)</label>
                <input
                    type="text"
                    value={pricePartData.apply_company}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>

            {/* Remarks */}
            <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">비고 (Remarks)</label>
                <textarea
                    value={pricePartData.remarks}
                    readOnly
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                ></textarea>
            </div>

            {/* User ID */}
            <div>
                <label className="block text-sm font-medium text-gray-700">사용자 ID (User ID)</label>
                <input
                    type="text"
                    value={pricePartData.user_id}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>

            {/* Note */}
            <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">메모 (Note)</label>
                <textarea
                    value={pricePartData.note}
                    readOnly
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                ></textarea>
            </div>

            {/* Update Date */}
            <div>
                <label className="block text-sm font-medium text-gray-700">업데이트 날짜 (Update Date)</label>
                <input
                    type="date"
                    value={pricePartData.update_date ? new Date(pricePartData.update_date).toISOString().slice(0, 10) : ''}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>
        </form>
    );
};

export default PricePartForm;
