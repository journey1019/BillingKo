import React from 'react';
import { formatDateTime, formatNumber } from '@/utils/formatHelpers.jsx';
import { formatPeriod, getTypeClass } from '@/options/DeviceDetailOption.jsx';

const UseByteDetailItem = ({ detailData, paymentInfo, paymentFeeDetail, dProductDetail }) => {
    console.log(paymentFeeDetail)
    return(
        <div className="flex flex-col gap-4">
            <div className="bg-white px-4">
                <h2 className="text-lg font-semibold pb-2">요금 발생 바이트 상세 정보</h2>
                {paymentFeeDetail.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md">
                        <table className="w-full text-sm text-center border-collapse">
                            <thead className="bg-gray-200 sticky -top-0.5 z-10">
                            <tr>
                                {["번호", "고객", "D_Product", "사용 기간", "기본 사용 바이트", "총 요금", "메모"].map((header, index) => (
                                    <th key={index}
                                        className="px-4 py-1 2xl:py-2 border font-medium whitespace-nowrap">{header}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {paymentFeeDetail
                                // .sort((a, b) => b.period_data - a.period_data) // 기간 기준 내림차순 정렬
                                .map((detail, index) => (
                                    <tr key={index}
                                        className="text-center text-sm 2xl:text-sm whitespace-nowrap bg-white">
                                        <td className="px-4 py-2 border">{index + 1}</td>
                                        <td className="px-4 py-2 border">{detail.apply_company}</td>
                                        <td className={`px-4 py-2 border ${getTypeClass(detail.classfication)}`}>{detail.classfication}</td>
                                        <td className="px-4 py-2 border">{formatPeriod(detail.act_date_period)}</td>
                                        <td className="p-2 border text-right">{formatNumber(detail.use_byte)}</td>
                                        <td className="px-4 py-2 borderfont-bold text-right">{formatNumber(detail.billing_fee)}</td>
                                        <td className="px-4 py-2 border">{detail.note}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="mt-2 text-gray-500 text-sm">상세 정보 없음</p>
                )}
            </div>

            <div className="bg-white p-4">
                <h2 className="text-lg font-semibold pb-2">사용 바이트 상세 정보</h2>
                {dProductDetail.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md">
                        <table className="w-full text-sm text-center border-collapse">
                            <thead className="bg-gray-200 sticky -top-0.5 z-10">
                            <tr>
                                {["번호", "연결 타입", "D_Product", "사용 기간", "Volume_Unit", "할인 코드", "체크 코드"].map((header, index) => (
                                    <th key={index}
                                        className="px-4 py-1 2xl:py-2 border font-medium whitespace-nowrap">{header}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {[...dProductDetail] // 원본 배열 보호를 위해 복사본 사용
                                .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime()) // event_date 기준 내림차순 정렬
                                .map((detail, index) => (
                                    <tr key={index} className="text-center text-sm 2xl:text-sm whitespace-nowrap bg-white">
                                        <td className="px-4 py-2 border">{index + 1}</td>
                                        <td className="px-4 py-2 border">{detail.con_type}</td>
                                        <td className={`px-4 py-2 border ${getTypeClass(detail.type)}`}>{detail.type.toUpperCase()}</td>
                                        <td className="px-4 py-2 border">{formatDateTime(detail.event_date)}</td>
                                        <td className="px-4 py-2 border text-right">{formatNumber(detail.volumn_unit)}</td>
                                        <td className="px-4 py-2 border text-right">{detail.discount_code}</td>
                                        <td className="px-4 py-2 border text-right">{detail.check_code}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="mt-2 text-gray-500 text-sm">상세 정보 없음</p>
                )}
            </div>
        </div>
    )
}
export default UseByteDetailItem;