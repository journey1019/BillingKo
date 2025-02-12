import React from 'react';

const PricePartForm = ({ pricePartData }) => {
    console.log(pricePartData)
    return (
        <form className="grid grid-cols-2 gap-3">
            {/* Price Plan ID */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">Price Plan ID (PPID)</label>
                <span className="mt-1 block text-sm 2xl:text-md">{pricePartData.ppid}</span>
            </div>

            {/* Basic Fee */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">기본 요금 (Basic Fee)</label>
                <span className="mt-1 block text-sm 2xl:text-md">{Number(pricePartData.basic_fee).toLocaleString()}</span>
            </div>

            {/* Subscription Fee */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">구독 요금 (Subscription Fee)</label>
                <span className="mt-1 block text-sm 2xl:text-md">{Number(pricePartData.subscription_fee).toLocaleString()}</span>
            </div>

            {/* Free Byte */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">무료 데이터 (Free Byte)</label>
                <span className="mt-1 block text-sm 2xl:text-md">{Number(pricePartData.free_byte).toLocaleString()}</span>
                {/*<input*/}
                {/*    type="number"*/}
                {/*    value={pricePartData.free_byte}*/}
                {/*    readOnly*/}
                {/*    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"*/}
                {/*/>*/}
            </div>

            {/* Surcharge Unit */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">초과 사용 단위 (Surcharge Unit)</label>
                <span className="mt-1 block text-sm 2xl:text-md">{Number(pricePartData.surcharge_unit).toLocaleString()}</span>
            </div>

            {/* Each Surcharge Fee */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">단위별 추가 요금 (Each Surcharge Fee)</label>
                <span className="mt-1 block text-sm 2xl:text-md">{Number(pricePartData.each_surcharge_fee).toLocaleString()}</span>
            </div>

            {/* Apply Company */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">적용 회사 (Apply Company)</label>
                <span className="mt-1 block text-sm 2xl:text-md">{pricePartData.apply_company}</span>
            </div>

            {/* Remarks */}
            <div className="col-span-2">
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">비고 (Remarks)</label>
                <span className="mt-1 block text-sm 2xl:text-md">{pricePartData.remarks}</span>
                {/*<textarea*/}
                {/*    value={pricePartData.remarks}*/}
                {/*    readOnly*/}
                {/*    rows="3"*/}
                {/*    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"*/}
                {/*></textarea>*/}
            </div>

            {/* User ID */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">사용자 ID (User ID)</label>
                <span className="mt-1 block text-sm 2xl:text-md">{pricePartData.user_id || 'N/A'}</span>
                {/*<input*/}
                {/*    type="text"*/}
                {/*    value={pricePartData.user_id}*/}
                {/*    readOnly*/}
                {/*    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"*/}
                {/*/>*/}
            </div>

            {/* Note */}
            <div className="col-span-2">
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">메모 (Note)</label>
                <span className="mt-1 block text-sm 2xl:text-md">{pricePartData.note}</span>
                {/*<textarea*/}
                {/*    value={pricePartData.note}*/}
                {/*    readOnly*/}
                {/*    rows="3"*/}
                {/*    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"*/}
                {/*></textarea>*/}
            </div>

            {/* Update Date */}
            <div>
                <label className="block text-xs 2xl:text-sm font-medium text-gray-500">업데이트 날짜 (Update Date)</label>
                <span className="mt-1 block text-sm 2xl:text-md">{pricePartData.update_date ? new Date(pricePartData.update_date).toISOString().split('T')[0]: 'N/A'}</span>
                {/*<input*/}
                {/*    type="date"*/}
                {/*    value={pricePartData.update_date ? new Date(pricePartData.update_date).toISOString().slice(0, 10) : ''}*/}
                {/*    readOnly*/}
                {/*    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"*/}
                {/*/>*/}
            </div>
        </form>
    );
};

export default PricePartForm;
