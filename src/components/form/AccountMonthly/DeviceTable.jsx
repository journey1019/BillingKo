import React, { useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { formatNumber } from "@/utils/formatHelpers";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

const DeviceTable = ({ accountData }) => {
    const [expandedRows, setExpandedRows] = useState({});

    // ✅ accountData가 배열인지 확인 후 처리
    const safeAccountData = Array.isArray(accountData) ? accountData : [];

    // ✅ 장치 데이터를 기반으로 테이블 데이터 구성
    const tableData = safeAccountData.flatMap((account) =>
        (account.device_detail || []).map((device) => ({
            ...device,
            acct_num: account.acct_num, // 계정 정보 추가
            adjustment_info: (account.adjustment_info || []).filter(
                (adj) => adj.serial_number === device.serial_number || adj.account_num === account.acct_num
            ),
            none_pay_info: account.none_pay_info || [],
        }))
    );

    // ✅ 행 클릭 시 확장 상태 토글 함수
    const toggleRowExpansion = (serialNumber) => {
        setExpandedRows((prev) => ({
            ...prev,
            [serialNumber]: !prev[serialNumber],
        }));
    };

    // ✅ 테이블 컬럼 정의
    const columns = [
        {
            accessorKey: "serial_number",
            header: "단말기 번호",
            size: 120,
            Cell: ({ row }) => (
                <div
                    className="flex items-center cursor-pointer"
                    onClick={() => toggleRowExpansion(row.original.serial_number)}
                >
                    {expandedRows[row.original.serial_number] ? (
                        <FaChevronDown className="text-gray-600 mr-2" />
                    ) : (
                        <FaChevronRight className="text-gray-600 mr-2" />
                    )}
                    {row.original.serial_number}
                </div>
            ),
        },
        { accessorKey: "period_data", header: "사용 기간", size: 80 },
        { accessorKey: "basic_fee", header: "기본 요금", size: 100, Cell: ({ cell }) => formatNumber(cell.getValue()) + " 원" },
        { accessorKey: "subscribe_fee", header: "가입비", size: 100, Cell: ({ cell }) => formatNumber(cell.getValue()) + " 원" },
        { accessorKey: "add_use_fee", header: "추가 사용료", size: 100, Cell: ({ cell }) => formatNumber(cell.getValue()) + " 원" },
        { accessorKey: "total_fee", header: "총 요금", size: 120, Cell: ({ cell }) => formatNumber(cell.getValue()) + " 원" },
    ];

    return (
        <div className="bg-white p-4 shadow-md rounded-lg">
            <MaterialReactTable
                columns={columns}
                data={tableData}
                enableRowActions
                getRowProps={({ row }) => ({
                    onClick: () => toggleRowExpansion(row.original.serial_number),
                    style: { cursor: "pointer" },
                })}
                renderDetailPanel={({ row }) => {
                    const { adjustment_info, none_pay_info } = row.original;
                    return (
                        <div className="p-4 bg-gray-100 rounded-lg">
                            {/* ✅ 조정 내역 */}
                            {adjustment_info.length > 0 && (
                                <div className="mb-3">
                                    <h3 className="text-sm font-semibold mb-2 text-gray-800">📌 조정 내역</h3>
                                    <div className="overflow-x-auto border rounded-md">
                                        <table className="w-full text-sm text-center">
                                            <thead className="bg-gray-200">
                                            <tr>
                                                {["조정 유형", "설명", "조정 금액"].map((header, index) => (
                                                    <th key={index} className="p-2 border">{header}</th>
                                                ))}
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {adjustment_info.map((adj, index) => (
                                                <tr key={index} className="text-center">
                                                    <td className="p-2 border">{adj.mount_type}</td>
                                                    <td className="p-2 border">{adj.description}</td>
                                                    <td className="p-2 border">{formatNumber(adj.adjustment_fee)} 원</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* ✅ 미납 내역 */}
                            {none_pay_info.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold mb-2 text-gray-800">📌 미납 내역</h3>
                                    <div className="overflow-x-auto border rounded-md">
                                        <table className="w-full text-sm text-center">
                                            <thead className="bg-gray-200">
                                            <tr>
                                                {["미납 금액", "추가 이자", "미납 기간"].map((header, index) => (
                                                    <th key={index} className="p-2 border">{header}</th>
                                                ))}
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {none_pay_info.map((np, index) => (
                                                <tr key={index} className="text-center">
                                                    <td className="p-2 border">{formatNumber(np.none_paid_fee)} 원</td>
                                                    <td className="p-2 border">{np.add_percent}%</td>
                                                    <td className="p-2 border">{np.none_paid_period} 개월</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {adjustment_info.length === 0 && none_pay_info.length === 0 && (
                                <p className="text-gray-500">📌 관련 조정 내역 및 미납 내역이 없습니다.</p>
                            )}
                        </div>
                    );
                }}
            />
        </div>
    );
};

export default DeviceTable;
