import { formatNumber } from "@/utils/formatHelpers.jsx";
import { FaDownload } from "react-icons/fa6";
import { exportDeviceDetailsToCSV } from '@/utils/deviceExporters';
/**
 * 다운로드 버튼 클릭 시 CSV 다운
 * */
export const KOMonthlyAccountTableOptions = (selectedRowId) => ({
    initialState: {
        sorting: [{ id: "acct_num", desc: true }],
        showColumnFilters: true,
        pagination: {
            pageSize: 50, // ✅ 페이지당 행 수를 50으로 지정
        },
    },
    enableMultiRowSelection: false,
    enablePagination: true,
    enableFilters: true,
    enableColumnVisibility: false,
    positionToolbarAlertBanner: "none",
    enableSorting: true,

    muiTableBodyRowProps: ({ row, table }) => ({
        onClick: (event) => {
            // console.log('Row clicked:', row.original);

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
            <div className="group p-4 bg-gray-100 rounded-md w-[calc(100vw-30rem)] max-w-screen-xl overflow-hidden">
                <div className="flex flex-row pb-2 items-center justify-between">
                    <h1 className="font-bold">장치 상세 정보</h1>
                    <button
                        onClick={() => exportDeviceDetailsToCSV(deviceDetails)}
                        className="group p-2 rounded-md hover:bg-gray-200 transition"
                    >
                        <FaDownload className="text-gray-500 group-hover:text-gray-800 transition" />
                    </button>
                </div>

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
});


/**
 * 다운로드 버튼 클릭 시 메뉴 - CSV & Excel 다운 가능 (스타일 조정 필요)
 * */
// import React, { useState } from "react";
// import { formatNumber } from "@/utils/formatHelpers.jsx";
// import { FaDownload } from "react-icons/fa6";
// import { exportDeviceDetailsToCSV, exportDeviceDetailsToExcel } from "@/utils/deviceExporters";
//
// export const KOMonthlyAccountTableOptions = (selectedRowId) => ({
//     initialState: {
//         sorting: [{ id: "acct_num", desc: true }],
//         showColumnFilters: true,
//         pagination: {
//             pageSize: 50, // ✅ 페이지당 행 수를 50으로 지정
//         },
//     },
//     enableMultiRowSelection: false,
//     enablePagination: true,
//     enableFilters: true,
//     enableColumnVisibility: false,
//     positionToolbarAlertBanner: "none",
//     enableSorting: true,
//
//     muiTableBodyRowProps: ({ row, table }) => ({
//         onClick: (event) => {
//             // console.log('Row clicked:', row.original);
//
//             // 선택 상태를 토글
//             row.getToggleSelectedHandler()(event);
//
//             // 추가 동작: 메타 속성을 통한 이벤트 전달 (예: Drawer 열기)
//             table.options.meta?.onRowSelect?.(row.original);
//         },
//         sx: {
//             cursor: 'pointer',
//             backgroundColor:
//                 selectedRowId?.acct_num === row.original.acct_num ? '#e2e8f0' : 'transparent', // ✅ 선택된 row 배경색
//             '&:hover': {
//                 backgroundColor: selectedRowId?.acct_num === row.original.acct_num ? '#cbd5e1' : '#f1f5f9',
//             },
//         },
//     }),
//
//     renderDetailPanel: ({ row }) => {
//         const deviceDetails = row.original.device_detail || [];
//         const [menuOpen, setMenuOpen] = useState(false);
//
//         // 추가
//         const handleExport = (type, data) => {
//             if (type === 'csv') exportDeviceDetailsToCSV(data);
//             else if (type === 'excel') exportDeviceDetailsToExcel(data);
//             setMenuOpen(false);
//         };
//
//
//         return (
//             <div className="group p-4 bg-gray-100 rounded-md w-[calc(100vw-30rem)] max-w-screen-xl overflow-hidden">
//                 <div className="flex flex-row pb-2 items-center justify-between">
//                     <h1 className="font-bold">장치 상세 정보</h1>
//
//                     {/* 다운로드 버튼 및 드롭다운 */}
//                     <div className="relative">
//                         <button
//                             onClick={() => setMenuOpen(!menuOpen)}
//                             className="group p-2 rounded-md hover:bg-gray-200 transition"
//                         >
//                             <FaDownload className="text-gray-500 group-hover:text-gray-800 transition" />
//                         </button>
//
//                         {menuOpen && (
//                             <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-300 rounded-md shadow-lg z-10">
//                                 <button
//                                     onClick={() => handleExport('csv', deviceDetails)}
//                                     className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
//                                 >
//                                     📄 CSV 다운로드
//                                 </button>
//                                 <button
//                                     onClick={() => handleExport('excel', deviceDetails)}
//                                     className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
//                                 >
//                                     📊 EXCEL 다운로드
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//
//                 <div className="col-span-3">
//                     {deviceDetails.length > 0 ? (
//                         <div className="max-h-52 overflow-y-auto border border-gray-300 rounded-md">
//                             <table className="w-full text-sm text-center border-collapse">
//                                 <thead className="bg-gray-200 sticky -top-0.5 z-10">
//                                 <tr>
//                                     {['번호', '별칭', '단말기', '사용 기간', '기본료', '통신료', '기타 사용료', '부가 서비스료', '사용 바이트 수 (b)', '총 요금'].map((header, index) => (
//                                         <th key={index}
//                                             className="px-2 py-1 border font-medium whitespace-nowrap">{header}</th>
//                                     ))}
//                                 </tr>
//                                 </thead>
//                                 <tbody className="bg-white">
//                                 {deviceDetails
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
//         );
//     }
// });

