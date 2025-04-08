import { formatNumber } from "@/utils/formatHelpers.jsx";
import { formatValue } from "@/utils/formatHelpers.jsx";
import { Switch } from "@mui/material";
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Typography } from "@mui/material";

export const KOMonthlyAccountTableOptions = (selectedRowId) => ({
    initialState: {
        sorting: [{ id: "acct_num", desc: true }],
        showColumnFilters: true,
    },
    enableMultiRowSelection: false,
    enablePagination: true,
    enableFilters: true,
    enableColumnVisibility: false,
    positionToolbarAlertBanner: "none",
    enableSorting: true,

    muiTableBodyRowProps: ({ row, table }) => ({
        onClick: (event) => {
            console.log('Row clicked:', row.original);

            // 선택 상태를 토글
            row.getToggleSelectedHandler()(event);

            // 추가 동작: 메타 속성을 통한 이벤트 전달 (예: Drawer 열기)
            table.options.meta?.onRowSelect?.(row.original);
        },
        sx: {
            cursor: 'pointer',
            backgroundColor:
                selectedRowId?.acct_num === row.original.acct_num ? '#e2e8f0' : 'transparent', // ✅ 선택된 row 배경색
            '&:hover': {
                backgroundColor: selectedRowId?.acct_num === row.original.acct_num ? '#cbd5e1' : '#f1f5f9',
            },
        },
    }),

    renderDetailPanel: ({ row }) => {
        const deviceDetails = row.original.device_detail || [];

        return (
            <div className="p-4 bg-gray-100 rounded-md w-[calc(100vw-40rem)] max-w-screen-xl overflow-hidden">
                <h1 className="pb-2 font-bold">
                    장치 상세 정보
                </h1>

                <div className="col-span-3">
                    {deviceDetails.length > 0 ? (
                        <div className="max-h-52 overflow-y-auto border border-gray-300 rounded-md">
                            <table className="w-full text-sm text-center border-collapse">
                                <thead className="bg-gray-200 sticky -top-0.5 z-10">
                                <tr>
                                    {['번호', '별칭', '단말기', '사용 기간', '기본료', '통신료', '기타 사용료', '부가 서비스료', '사용 바이트 수 (b)', '총 요금'].map((header, index) => (
                                        <th key={index}
                                            className="px-2 py-1 border font-medium whitespace-nowrap">{header}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody className="bg-white">
                                {deviceDetails
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
        );
    }
    // renderDetailPanel: ({ row }) => {
    //     const accountInfo = row.original.account_info || {};
    //     const deviceDetails = row.original.device_detail || [];
    //     const adjustmentInfo = row.original.adjustment_info || [];
    //     const nonePayInfo = row.original.none_pay_info || [];
    //
    //     return (
    //         <div className="grid grid-cols-2 p-4 bg-gray-50 rounded-lg">
    //             {/* 고객 정보 */}
    //             <div className="pr-2">
    //                 <h2 className="text-base font-semibold mb-2">고객 정보</h2>
    //                 <div className="bg-white p-3 rounded-md border border-gray-300">
    //                     {[
    //                         ["계정 번호", row.original.acct_num],
    //                         ["계정 등록 번호", accountInfo.acct_resident_num],
    //                         ["구분", accountInfo.classification],
    //                         ["기관명", accountInfo.acct_name],
    //                         ["청구 주소", `(${accountInfo.invoice_postcode || "-"}) ${formatValue(accountInfo.invoice_address)}`],
    //                         ["청구 주소 2", formatValue(accountInfo.invoice_address2)],
    //                     ].map(([label, value], index) => (
    //                         <p key={index}>
    //                             <span>{label}: </span>
    //                             <span className="font-semibold">{formatValue(value)}</span>
    //                         </p>
    //                     ))}
    //                     <p>
    //                         <span>사용 유무: </span>
    //                         <Switch checked={accountInfo.use_yn === "Y"} disabled size="small"/>
    //                     </p>
    //                 </div>
    //             </div>
    //
    //             {/* 요금 정보 */}
    //             <div>
    //                 <h2 className="text-base font-semibold mb-2">요금 정보</h2>
    //                 <div className="bg-white p-3 rounded-md border border-gray-300">
    //                     {[
    //                         ["기본료", `${formatNumber(row.original.basic_fee_total)} 원 (${row.original.basic_fee_count}개)`],
    //                         ["부가세", `${formatNumber(row.original.tax_fee)}원 (${accountInfo.tax_percent}%)`],
    //                         ["추가 사용료", `${formatNumber(row.original.add_use_fee_total)} 원 (${row.original.add_use_fee_count}개)`],
    //                         ["절사 금액", formatNumber(row.original.cut_off_fee) + " 원"],
    //                         ["조정 금액", `${formatNumber(row.original.modification_fee_total)} 원 (${row.original.modification_fee_count}개)`],
    //                         ["미납 금액", formatNumber(row.original.none_pay_fee) + " 원"],
    //                         ["최종 납부액", formatNumber(row.original.final_fee) + " 원"],
    //                     ].map(([label, value], index) => (
    //                         <p key={index}>
    //                             <span>{label}: </span>
    //                             <span className="font-semibold">{value}</span>
    //                         </p>
    //                     ))}
    //                 </div>
    //             </div>
    //
    //             {/* 디바이스 정보 */}
    //             <h2 className="text-base font-semibold col-span-2 mt-4">디바이스 상세 정보</h2>
    //             <div className="col-span-2">
    //                 {deviceDetails.length > 0 ? (
    //                     <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md">
    //                         <table className="w-full text-sm text-center">
    //                             <thead className="bg-gray-200">
    //                             <tr>
    //                                 {["번호", "Alias", "단말기", "사용 기간", "기본 요금", "가입비", "추가 사용료", "조정 금액", "사용 바이트 수","총 요금"].map((header, index) => (
    //                                     <th key={index} className="p-2 border">{header}</th>
    //                                 ))}
    //                             </tr>
    //                             </thead>
    //                             <tbody>
    //                             {deviceDetails
    //                                 .sort((a, b) => b.period_data - a.period_data) // 기간 기준 내림차순 정렬
    //                                 .map((device, index) => (
    //                                     <tr key={index} className="text-center">
    //                                         <td className="p-2 border">{index + 1}</td>
    //                                         <td className="p-2 border">{device.alias}</td>
    //                                         <td className="p-2 border">{device.serial_number}</td>
    //                                         <td className="p-2 border">{device.period_data}일</td>
    //                                         <td className="p-2 border">{formatNumber(device.basic_fee)} 원</td>
    //                                         <td className="p-2 border">{formatNumber(device.subscribe_fee)} 원</td>
    //                                         <td className="p-2 border">{formatNumber(device.add_use_fee)} 원</td>
    //                                         <td className="p-2 border">{formatNumber(device.modification_fee)} 원</td>
    //                                         <td className="p-2 border">{formatNumber(device.use_byte_total)} byte </td>
    //                                         <td className="p-2 border font-bold">{formatNumber(device.total_fee)} 원</td>
    //                                     </tr>
    //                                 ))}
    //                             </tbody>
    //                         </table>
    //                     </div>
    //                 ) : (
    //                     <p className="mt-2 text-gray-500">디바이스 정보 없음</p>
    //                 )}
    //             </div>
    //
    //             {/* 조정 내역 */}
    //             <div className="pr-2">
    //                 <h2 className="text-base font-semibold col-span-2 mt-4">조정 내역</h2>
    //                 <div className="col-span-2">
    //                     {adjustmentInfo.length > 0 ? (
    //                         <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md">
    //                             <table className="w-full text-sm text-center">
    //                                 <thead className="bg-gray-200">
    //                                 <tr>
    //                                     {["조정 유형", "조정 대상", "조정 분류", "조정 타입", "요금 기준", "조정 금액", "설명"].map((header, index) => (
    //                                         <th key={index} className="p-2 border">{header}</th>
    //                                     ))}
    //                                 </tr>
    //                                 </thead>
    //                                 <tbody>
    //                                 {adjustmentInfo.map((adj, index) => (
    //                                     <tr key={index} className="text-center">
    //                                         <td className="p-2 border">{formatValue(adj.adjustment_code)}</td>
    //                                         <td className="p-2 border">{formatValue(adj.adjustment_value)}</td>
    //                                         <td className="p-2 border">{formatValue(adj.adjustment_category)}</td>
    //                                         <td className="p-2 border">{formatValue(adj.adjustment_type)}</td>
    //                                         <td className="p-2 border">{formatValue(adj.mount_type)}</td>
    //                                         <td className="p-2 border">{formatNumber(adj.adjustment_fee)} 원</td>
    //                                         <td className="p-2 border">{formatValue(adj.description)}</td>
    //                                     </tr>
    //                                 ))}
    //                                 </tbody>
    //                             </table>
    //                         </div>
    //                     ) : (
    //                         <p className="mt-2 text-gray-500">조정 내역 없음</p>
    //                     )}
    //                 </div>
    //             </div>
    //
    //             {/* 미납 내역 */}
    //             <div>
    //                 <h2 className="text-base font-semibold col-span-2 mt-4">미납 내역</h2>
    //                 <div className="col-span-2">
    //                     {nonePayInfo.length > 0 ? (
    //                         <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md">
    //                             <table className="w-full text-sm text-center">
    //                                 <thead className="bg-gray-200">
    //                                 <tr>
    //                                     {["미납 금액", "추가 이자", "미납 기간"].map((header, index) => (
    //                                         <th key={index} className="p-2 border">{header}</th>
    //                                     ))}
    //                                 </tr>
    //                                 </thead>
    //                                 <tbody>
    //                                 {nonePayInfo.map((np, index) => (
    //                                     <tr key={index} className="text-center">
    //                                         <td className="p-2 border">{formatNumber(np.none_paid_fee)} 원</td>
    //                                         <td className="p-2 border">{np.add_percent}%</td>
    //                                         <td className="p-2 border">{np.none_paid_period} 개월</td>
    //                                     </tr>
    //                                 ))}
    //                                 </tbody>
    //                             </table>
    //                         </div>
    //                     ) : (
    //                         <p className="mt-2 text-gray-500">미납 내역 없음</p>
    //                     )}
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // },
});
