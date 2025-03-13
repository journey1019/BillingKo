import { formatDateTime, formatNumber, formatValue } from '@/utils/formatHelpers.jsx';
import InnerAccordion from '@/components/ui/Accordions/InnerAccordion.jsx';
import DeviceTable from './DeviceTable.jsx';

const acctAccordionItem= ({ accountData, accountInfo }) => [
    {
        title: '담당자 정보',
        content: (
            <>
                <div className="text-xs px-3">
                    {[
                        ['직장명', accountInfo.company_name],
                        ['담당 부서', accountInfo.company_team],
                        ['담당자', accountData.company_director],
                        ['이메일', accountInfo.director_email],
                        ['직장 전화', accountInfo.company_tel],
                        ['이동 전화', accountInfo.director_tel],
                        ['고객 주소', `(${accountInfo.company_postcode || '-'}) ${formatValue(accountInfo.company_address)}`],
                        ['고객 주소2', formatValue(accountInfo.company_address2)],
                    ].map(([label, value], index) => (
                        <p key={index} className="grid grid-cols-5 2xl:grid-cols-3 gap-4 py-0.5">
                            <span className="text-xs text-gray-500 col-span-2 2xl:col-span-1 text-left">{label}</span>
                            <span className="font-normal col-span-3 2xl:col-span-2 text-left text-black">{formatValue(value)}</span>
                        </p>
                    ))}
                </div>
            </>
        )
    }
]

export const accordionItems = ({ accountData, accountInfo, deviceDetail, adjustmentInfo, nonePayInfo }) => [
    {
        title: "고객 정보",
        content: (
            <>
                <div className="text-sm p-3 rounded-md">
                    {[
                        ['계정 번호', accountData.acct_num],
                        ['계정 등록 번호', accountInfo.acct_resident_num],
                        ['고객 구분', accountInfo.account_type],
                        ['구분 단위', accountInfo.classification],
                        ['기관명', accountInfo.acct_name],
                        ['사업자 등록 번호', accountInfo.business_num],
                        ['법인(주민) 번호', accountInfo.recognize_id],
                        ['우편번호', `${accountInfo.invoice_postcode || '-'}`],
                        ['청구 주소', `${formatValue(accountInfo.invoice_address)}`],
                        ['청구 주소 2', formatValue(accountInfo.invoice_address2)],
                        ['등록 일자', formatDateTime(accountInfo.regist_date)],
                    ].map(([label, value], index) => (
                        <p key={index} className="grid grid-cols-3 gap-4 py-0.5">
                            <span className="text-xs text-gray-500 col-span-1 text-left">{label}</span>
                            <span className="font-normal col-span-2 text-left text-black">{formatValue(value)}</span>
                        </p>
                    ))}
                    <div className="text-sm">
                        <InnerAccordion items={acctAccordionItem({ accountData, accountInfo })} />
                    </div>
                </div>
                {/*<div className="text-sm p-3 rounded-md">*/}
                {/*    {[*/}
                {/*        ['계정 번호', accountData.acct_num],*/}
                {/*        ['계정 등록 번호', accountInfo.acct_resident_num],*/}
                {/*        ['고객 구분', accountInfo.account_type],*/}
                {/*        ['구분 단위', accountInfo.classification],*/}
                {/*        ['기관명', accountInfo.acct_name],*/}
                {/*        ['사업자 등록 번호', accountInfo.business_num],*/}
                {/*        ['법인(주민) 번호', accountInfo.recognize_id],*/}
                {/*        ['청구 주소', `(${accountInfo.invoice_postcode || '-'}) ${formatValue(accountInfo.invoice_address)}`],*/}
                {/*        ['청구 주소 2', formatValue(accountInfo.invoice_address2)],*/}
                {/*        ['등록 일자', formatDateTime(accountInfo.regist_date)],*/}
                {/*    ].map(([label, value], index) => (*/}
                {/*        <p key={index} className="grid grid-cols-3 gap-4 py-0.5">*/}
                {/*            <span className="text-xs text-gray-500 col-span-1 text-left">{label}</span>*/}
                {/*            <span className="font-normal col-span-2 text-left text-black">{formatValue(value)}</span>*/}
                {/*        </p>*/}
                {/*    ))}*/}
                {/*    <div className="text-sm">*/}
                {/*        <InnerAccordion items={acctAccordionItem({ accountData, accountInfo })} />*/}
                {/*    </div>*/}
                {/*</div>*/}
            </>
        ),
    },
    {
        title: '요금 정보',
        content: (
            <>
                <div className="text-sm p-3 border-b">
                    {[
                        [`기본료 (${accountData.basic_fee_count}개)`, `${formatNumber(accountData.basic_fee_total)}`],
                        ['통신료', `${formatNumber(accountData.add_use_fee_total)}`],
                        ['수수료', `0`],
                        ['부가 서비스료', `${formatNumber(accountData.modification_fee_total)}`],
                        ['기타 사용료', `${formatNumber(accountData.subscribe_fee_total)}`],
                    ].map(([label, value], index) => (
                        <p key={index} className="grid grid-cols-2 gap-4 py-0.5">
                            <span className="text-xs text-gray-500 col-span-1 text-left">{label}</span>
                            <span className="font-normal col-span-1 text-right">{formatValue(value)}</span>
                        </p>
                    ))}
                </div>
                <div className="text-sm p-3 border-b">
                    {[
                        ['공급가액', `${formatNumber(accountData.total_fee)}`],
                        ['부가 가치세', `${formatNumber(accountData.tax_fee)}`],
                        ['절사 금액', accountData.cut_off_fee ? `-${formatNumber(accountData.cut_off_fee)}원` : '0'],
                    ].map(([label, value], index) => (
                        <p key={index} className="grid grid-cols-2 gap-4 py-0.5">
                            <span className="text-xs text-gray-500 col-span-1 text-left">{label}</span>
                            <span className="font-normal col-span-1 text-right">{formatValue(value)}</span>
                        </p>
                    ))}
                </div>
                <div className="text-sm p-3">
                    {[
                        ['당월 납부 금액', `${formatNumber(accountData.monthly_final_fee)}`],
                        ['조정 금액', `${formatNumber(accountData.modification_tax_free_total)}`],
                        ['연체 가산금', `${formatNumber(accountData.late_payment_penalty_fee)}`],
                        ['미납 금액', `${formatNumber(accountData.none_pay_fee)}`],
                    ].map(([label, value], index) => (
                        <p key={index} className="grid grid-cols-2 gap-4 py-0.5">
                            <span className="text-xs text-gray-500 col-span-1 text-left">{label}</span>
                            <span className="font-normal col-span-1 text-right">{formatValue(value)}</span>
                        </p>
                    ))}
                    <p className="grid grid-cols-2 gap-4 pt-3 mt-3 border-t">
                        <span className="text-xs text-gray-500 col-span-1 text-left">최종 납부액</span>
                        <span className="col-span-1 text-right font-bold">{formatNumber(accountData.final_fee)}</span>
                    </p>
                </div>
            </>
        ),
    },
    // {
    //     title: '디바이스 상세 정보',
    //     content: (
    //         <>
    //             <div className="col-span-3 px-2 pb-2">
    //                 {/*<div className="col-span-3 flex flex-row justify-between items-center">*/}
    //                 {/*    <h2 className="text-base font-semibold col-span-3">디바이스 상세 정보</h2>*/}
    //                 {/*    /!*<FaPlus/>*!/*/}
    //                 {/*</div>*/}
    //                 <div className="col-span-3">
    //                     {deviceDetail.length > 0 ? (
    //                         <div className="max-h-52 overflow-y-auto border border-gray-300 rounded-md">
    //                             <table className="w-full text-sm text-center border-collapse">
    //                                 <thead className="bg-gray-200 sticky -top-0.5 z-10">
    //                                 <tr>
    //                                     {["번호", "별칭", "단말기", "사용 기간", "기본료", "통신료", "기타 사용료", "부가 서비스료", "사용 바이트 수 (b)", "총 요금"].map((header, index) => (
    //                                         <th key={index}
    //                                             className="px-2 py-1 border font-medium whitespace-nowrap">{header}</th>
    //                                     ))}
    //                                 </tr>
    //                                 </thead>
    //                                 <tbody>
    //                                 {deviceDetail
    //                                     .sort((a, b) => b.period_data - a.period_data) // 기간 기준 내림차순 정렬
    //                                     .map((device, index) => (
    //                                         <tr key={index} className="text-center text-xs whitespace-nowrap">
    //                                             <td className="px-2 py-1 border">{index + 1}</td>
    //                                             <td className="px-2 py-1 border text-blue-500 cursor-pointer hover:underline">{device.alias}</td>
    //                                             <td className="px-2 py-1 border">{device.serial_number}</td>
    //                                             <td className="px-2 py-1 border">{device.period_data}</td>
    //                                             <td className="px-2 py-1 border">{formatNumber(device.basic_fee)}</td>
    //                                             <td className="px-2 py-1 border">{formatNumber(device.add_use_fee)}</td>
    //                                             <td className="px-2 py-1 border">{formatNumber(device.subscribe_fee)}</td>
    //                                             <td className="px-2 py-1 border">{formatNumber(device.modification_fee)}</td>
    //                                             <td className="px-2 py-1 border">{formatNumber(device.use_byte_total)}</td>
    //                                             <td className="px-2 py-1 border font-bold">{formatNumber(device.total_fee)}</td>
    //                                         </tr>
    //                                     ))}
    //                                 </tbody>
    //                             </table>
    //                         </div>
    //                     ) : (
    //                         <p className="mt-2 text-gray-500 text-sm">디바이스 정보 없음</p>
    //                     )}
    //                 </div>
    //             </div>
    //         </>
    //     ),
    // },
    // {
    //     title: '조정 내역',
    //     content: (
    //         <>
    //             <div className="col-span-3 space-x-2 px-2 pb-2">
    //                 <div className="grid grid-cols-2 gap-4 w-full">
    //                     {/* 조정 내역 */}
    //                     <div>
    //                         <h2 className="text-base font-semibold col-span-3">조정 내역</h2>
    //                         <div className="col-span-3">
    //                             {Array.isArray(adjustmentInfo) && adjustmentInfo.length > 0 ? (
    //                                 <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md">
    //                                     <table className="w-full text-sm text-center">
    //                                         <thead className="bg-gray-200">
    //                                         <tr>
    //                                             {["조정 유형", "조정 대상", "조정 분류", "조정 타입", "요금 기준", "조정 금액", "설명"].map((header, index) => (
    //                                                 <th key={index}
    //                                                     className="px-2 py-1 border font-medium whitespace-nowrap">{header}</th>
    //                                             ))}
    //                                         </tr>
    //                                         </thead>
    //                                         <tbody>
    //                                         {adjustmentInfo.map((adj, index) => (
    //                                             <tr key={index} className="text-center text-xs whitespace-nowrap">
    //                                                 <td className="p-2 border">{formatValue(adj.adjustment_code)}</td>
    //                                                 <td className="p-2 border">{formatValue(adj.adjustment_value)}</td>
    //                                                 <td className="p-2 border">{formatValue(adj.adjustment_category)}</td>
    //                                                 <td className="p-2 border">{formatValue(adj.adjustment_type)}</td>
    //                                                 <td className="p-2 border">{formatValue(adj.mount_type)}</td>
    //                                                 <td className="p-2 border">{formatNumber(adj.adjustment_fee)} 원</td>
    //                                                 <td className="p-2 border">{formatValue(adj.description)}</td>
    //                                             </tr>
    //                                         ))}
    //                                         </tbody>
    //                                     </table>
    //                                 </div>
    //                             ) : (
    //                                 <p className="mt-2 text-gray-500 text-sm">조정 내역 없음</p>
    //                             )}
    //                         </div>
    //                     </div>
    //                     {/* 미납 내역 */}
    //                     <div>
    //                         <h2 className="text-base font-semibold col-span-3">미납 내역</h2>
    //                         <div className="col-span-3">
    //                             {Array.isArray(nonePayInfo) && nonePayInfo.length > 0 ? (
    //                                 <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md">
    //                                     <table className="w-full text-sm text-center">
    //                                         <thead className="bg-gray-200">
    //                                         <tr>
    //                                             {["미납 금액", "추가 이자", "미납 기간"].map((header, index) => (
    //                                                 <th key={index}
    //                                                     className="px-2 py-1 border font-medium whitespace-nowrap">{header}</th>
    //                                             ))}
    //                                         </tr>
    //                                         </thead>
    //                                         <tbody>
    //                                         {nonePayInfo.map((np, index) => (
    //                                             <tr key={index} className="text-center text-xs whitespace-nowrap">
    //                                                 <td className="p-2 border">{formatNumber(np.none_paid_fee)} 원</td>
    //                                                 <td className="p-2 border">{np.add_percent}%</td>
    //                                                 <td className="p-2 border">{np.none_paid_period} 개월</td>
    //                                             </tr>
    //                                         ))}
    //                                         </tbody>
    //                                     </table>
    //                                 </div>
    //                             ) : (
    //                                 <p className="mt-2 text-gray-500 text-sm">미납 내역 없음</p>
    //                             )}
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </>
    //     )
    // }
];

export const accordionDeviceItems = ({ accountData, accountInfo, deviceDetail, adjustmentInfo, nonePayInfo }) => [
    {
        title: '디바이스 상세 정보',
        content: (
            <>
                <div className="col-span-3 px-2 pb-2">
                    <div className="col-span-3 flex flex-row justify-between items-center">
                        <h2 className="text-base font-semibold col-span-3">디바이스 상세 정보</h2>
                        {/*<FaPlus/>*/}
                    </div>
                    <div className="col-span-3">
                        {deviceDetail.length > 0 ? (
                            <div className="max-h-52 overflow-y-auto border border-gray-300 rounded-md">
                                <table className="w-full text-sm text-center border-collapse">
                                    <thead className="bg-gray-200 sticky -top-0.5 z-10">
                                    <tr>
                                        {["번호", "별칭", "단말기", "사용 기간", "기본료", "통신료", "기타 사용료", "부가 서비스료", "사용 바이트 수 (b)", "총 요금"].map((header, index) => (
                                            <th key={index}
                                                className="px-2 py-1 border font-medium whitespace-nowrap">{header}</th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {deviceDetail
                                        .sort((a, b) => b.period_data - a.period_data) // 기간 기준 내림차순 정렬
                                        .map((device, index) => (
                                            <tr key={index} className="text-center text-xs whitespace-nowrap">
                                                <td className="px-2 py-1 border">{index + 1}</td>
                                                <td className="px-2 py-1 border text-blue-500 cursor-pointer hover:underline">{device.alias}</td>
                                                <td className="px-2 py-1 border">{device.serial_number}</td>
                                                <td className="px-2 py-1 border">{device.period_data}</td>
                                                <td className="px-2 py-1 border">{formatNumber(device.basic_fee)}</td>
                                                <td className="px-2 py-1 border">{formatNumber(device.add_use_fee)}</td>
                                                <td className="px-2 py-1 border">{formatNumber(device.subscribe_fee)}</td>
                                                <td className="px-2 py-1 border">{formatNumber(device.modification_fee)}</td>
                                                <td className="px-2 py-1 border">{formatNumber(device.use_byte_total)}</td>
                                                <td className="px-2 py-1 border font-bold">{formatNumber(device.total_fee)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="mt-2 text-gray-500 text-sm">디바이스 정보 없음</p>
                        )}
                    </div>
                </div>
            </>
        ),
    },
    {
        title: '조정 내역',
        content: (
            <>
                <div className="col-span-3 space-x-2 px-2 pb-2">
                    <div className="grid grid-cols-2 gap-4 w-full">
                        {/* 조정 내역 */}
                        <div>
                            <h2 className="text-base font-semibold col-span-3">조정 내역</h2>
                            <div className="col-span-3">
                                {Array.isArray(adjustmentInfo) && adjustmentInfo.length > 0 ? (
                                    <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md">
                                        <table className="w-full text-sm text-center">
                                            <thead className="bg-gray-200">
                                            <tr>
                                                {["조정 유형", "조정 대상", "조정 분류", "조정 타입", "요금 기준", "조정 금액", "설명"].map((header, index) => (
                                                    <th key={index}
                                                        className="px-2 py-1 border font-medium whitespace-nowrap">{header}</th>
                                                ))}
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {adjustmentInfo.map((adj, index) => (
                                                <tr key={index} className="text-center text-xs whitespace-nowrap">
                                                    <td className="p-2 border">{formatValue(adj.adjustment_code)}</td>
                                                    <td className="p-2 border">{formatValue(adj.adjustment_value)}</td>
                                                    <td className="p-2 border">{formatValue(adj.adjustment_category)}</td>
                                                    <td className="p-2 border">{formatValue(adj.adjustment_type)}</td>
                                                    <td className="p-2 border">{formatValue(adj.mount_type)}</td>
                                                    <td className="p-2 border">{formatNumber(adj.adjustment_fee)} 원</td>
                                                    <td className="p-2 border">{formatValue(adj.description)}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="mt-2 text-gray-500 text-sm">조정 내역 없음</p>
                                )}
                            </div>
                        </div>
                        {/* 미납 내역 */}
                        <div>
                            <h2 className="text-base font-semibold col-span-3">미납 내역</h2>
                            <div className="col-span-3">
                                {Array.isArray(nonePayInfo) && nonePayInfo.length > 0 ? (
                                    <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md">
                                        <table className="w-full text-sm text-center">
                                            <thead className="bg-gray-200">
                                            <tr>
                                                {["미납 금액", "추가 이자", "미납 기간"].map((header, index) => (
                                                    <th key={index}
                                                        className="px-2 py-1 border font-medium whitespace-nowrap">{header}</th>
                                                ))}
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {nonePayInfo.map((np, index) => (
                                                <tr key={index} className="text-center text-xs whitespace-nowrap">
                                                    <td className="p-2 border">{formatNumber(np.none_paid_fee)} 원</td>
                                                    <td className="p-2 border">{np.add_percent}%</td>
                                                    <td className="p-2 border">{np.none_paid_period} 개월</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="mt-2 text-gray-500 text-sm">미납 내역 없음</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
];