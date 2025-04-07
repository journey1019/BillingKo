import { useEffect, useState, useMemo } from "react";
import { formatDateTime, formatNumber, formatValue } from '@/utils/formatHelpers.jsx';
import BasicDropdownForm from '@/components/form/Monthly/Edit/BasicDropdownForm.jsx';
import UsageDetailDropdownForm from '@/components/form/Monthly/Edit/UsageDetailDropdownForm.jsx';
import PaymentDropdownForm from '@/components/form/Monthly/Edit/PaymentDropdownForm.jsx';
import useKOMonthlyStore from '@/stores/koMonthlyStore.js';

/**
 * @desc: 단말기별 청구서 수정 페이지_Device Left Form
 * @param (Object) detailData: 전체 단말 정보
 * @param (Object) paymentInfo: 단말 요금 정보
 * @param (Array) paymentFeeDetail: 요금 사용 세부 정보
 * @param (Array) paymentAdjustmentInfo: 조정 세부 정보
 * */
export const accordionItems = ({ detailData, paymentInfo, version, yearMonth }) => {
    const { fetchDetailData } = useKOMonthlyStore();

    const hasVersion = typeof version === "number" // ✅ version 데이터가 존재하고, 숫자인지 확인
    console.log('version: ', version)
    console.log(detailData)

    return [
        {
            title: "기본 정보",
            content: (
                <>
                    <div className="relative text-sm p-3 rounded-md">
                        {hasVersion && (
                            <div className="absolute top-0 right-2">
                                <BasicDropdownForm detailData={detailData} fetchDetailData={fetchDetailData} yearMonth={yearMonth}/>
                            </div>
                        )}
                        {[
                            ['Profile ID', detailData.profile_id],
                            ['고객 번호', detailData.acct_num],
                            ['별칭', detailData.alias],
                            ['단말기', detailData.serial_number],
                            ['PPID', detailData.ppid],
                            ['활성화 날짜', formatDateTime(detailData.activate_date) || '-'],
                            ['비활성화 날짜', formatDateTime(detailData.deactivate_date) || '-'],
                        ].map(([label, value], index) => (
                            <p key={index} className="grid grid-cols-3 gap-4 py-0.5">
                                <span className="text-xs text-gray-500 col-span-1 text-left">{label}</span>
                                <span className="font-normal col-span-2 text-left text-black">{formatValue(value)}</span>
                            </p>
                        ))}
                    </div>
                </>
            )
        },
        {
            title: 'Byte 사용 정보',
            content: (
                <>
                    <div className="relative text-sm p-3 rounded-md">
                        {/*{hasVersion && (*/}
                        {/*    <div className="absolute top-0 right-2">*/}
                        {/*        <UsageDetailDropdownForm detailData={detailData} fetchDetailData={fetchDetailData} />*/}
                        {/*    </div>*/}
                        {/*)}*/}
                        {[
                            ['무료 바이트 제공량(b)', formatNumber(detailData.free_bytes)],
                            ['총 사용 바이트(b)', formatNumber(detailData.use_byte_total)],
                            ['월간 사용 기간', detailData.use_period],
                            ['월간 사용 비율(%)', detailData.use_percent_of_month]
                        ].map(([label, value], index) => (
                            <p key={index} className="grid grid-cols-2 gap-4">
                                <span className="text-xs text-gray-500 col-span-1 text-left">{label}</span>
                                <span className="font-normal col-span-1 text-right">{formatValue(value)}</span>
                            </p>
                        ))}
                    </div>
                </>
            )
        },
        {
            title: "요금 정보",
            content: (
                <>
                    <div className="relative text-sm p-3 rounded-md">
                        {/*{hasVersion && (*/}
                        {/*    <div className="absolute top-0 right-2">*/}
                        {/*        <PaymentDropdownForm detailData={detailData} />*/}
                        {/*    </div>*/}
                        {/*)}*/}
                        {[
                            ['기본료', formatNumber(paymentInfo.basic_fee)],
                            ['통신료', formatNumber(paymentInfo.add_use_fee)],
                            ['가입비', formatNumber(paymentInfo.subscribe_fee)],
                            ['절사 금액', formatNumber(paymentInfo.cut_off_fee)],
                            ['부가 서비스료', formatNumber(paymentInfo.modification_fee)],
                        ].map(([label, value], index) => (
                            <p key={index} className="grid grid-cols-2 gap-4 py-0.5">
                                <span className="text-xs text-gray-500 col-span-1 text-left">{label}</span>
                                <span className="font-normal col-span-1 text-right">{formatValue(value)}</span>
                            </p>
                        ))}
                        <p className="grid grid-cols-2 gap-4 pt-3 mt-3 border-t">
                            <span className="text-xs text-gray-500 col-span-1 text-left">최종 금액</span>
                            <span className="col-span-1 text-right font-bold">{formatNumber(paymentInfo.total_fee)}</span>
                        </p>
                    </div>
                </>
            )
        }
    ]
}