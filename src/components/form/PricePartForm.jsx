import React from 'react';
import { formatDateTime } from '@/utils/formatHelpers.jsx';

const PricePartForm = ({ pricePartData }) => {
    return (
        <div className="space-y-4 max-w-2xl items-center bg-white justify-start">
            {/* ✅ 전체 레이아웃을 제한 (너비 조절 및 가독성 개선) */}

            {/* ✅ 업데이트 정보 (맨 위에 표시) */}
            <div className="text-gray-500 text-xs 2xl:text-sm mb-3 border-b pb-2">
                <div className="flex flex-row space-x-3">
                    <span>Updated By</span>
                    <span className="text-gray-700 font-semibold">{pricePartData?.user_id || '-'}</span>
                </div>
                <div className="flex flex-row space-x-2">
                    <span>Last Update</span>
                    <span className="text-gray-700 font-semibold">{formatDateTime(pricePartData?.update_date) || '-'}</span>
                </div>
            </div>

            {/* ✅ 가격 정보 폼 */}
            <form className="grid grid-cols-1 gap-3">
                {[
                    { label: "PPID (Price Plan ID)", value: pricePartData.ppid },
                    { label: "고객", value: pricePartData.apply_company },
                    { label: "기본료", value: Number(pricePartData.basic_fee).toLocaleString(), isNumber: true },
                    { label: "가입비", value: Number(pricePartData.subscription_fee).toLocaleString(), isNumber: true },
                    { label: "무료 데이터", value: Number(pricePartData.free_byte).toLocaleString(), isNumber: true },
                    { label: "초과 사용 과금 단위", value: Number(pricePartData.surcharge_unit).toLocaleString(), isNumber: true },
                    { label: "초과 사용 과금 금액", value: Number(pricePartData.each_surcharge_fee).toLocaleString(), isNumber: true },
                    { label: "비고", value: pricePartData.remarks, spanFull: true },
                    { label: "메모", value: pricePartData.note, spanFull: true },
                ].map((item, index) => (
                    <div
                        key={index}
                        className={`grid grid-cols-3 items-center gap-4 ${item.spanFull ? 'col-span-1' : ''}`}
                    >
                        <label className="text-xs 2xl:text-sm font-medium text-gray-500 text-left">
                            {item.label}
                        </label>
                        <span
                            className={`text-sm 2xl:text-md col-span-2 p-1 rounded-md ${
                                item.isNumber
                                    ? 'text-right bg-gray-100 font-semibold'  // ✅ 숫자는 강조된 배경 추가
                                    : 'text-left'
                            }`}
                        >
                            {item.value}
                        </span>
                    </div>
                ))}
            </form>
        </div>
    );
};

export default PricePartForm;
