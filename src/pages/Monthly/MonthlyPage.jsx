import { useState, useEffect } from "react";
import useApiFetch from "@/hooks/useApiFetch.js";
import { fetchMonthlyData, saveMonthlyData, fetchMonthlyDetailData } from '@/service/monthlyService.js'; // API 호출 함수
import { MonthlyTableColumns } from "@/columns/MonthlyTableColumns.jsx";
import { MonthlyTableOptions } from "@/options/MonthlyTableOptions.jsx";
import ReusableTable from "@/components/table/ReusableTable.jsx";
import MonthPicker from "@/components/time/MonthPicker.jsx";
import LoadingSpinner from '@/components/common/LoadingSpinner.jsx';

import useYearMonth from '@/hooks/useYearMonth.js';
import MonthlyForm from '@/components/form/Monthly/MonthlyForm.jsx';
import SaveButton from '@/components/common/SaveButton.jsx';

const MonthlyPage = () => {
    const { selectedDate, handleDateChange, yearMonth } = useYearMonth();

    // API 호출: useApiFetch를 활용
    const { data, loading, error } = useApiFetch(fetchMonthlyData, yearMonth);

    // Table Row Click
    const [selectedRowData, setSelectedRowData] = useState(null); // 선택된 Row의 데이터 저장
    const [isExpanded, setIsExpanded] = useState(false);

    const [detailData, setDetailData] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState(null);


    console.log(yearMonth)
    useEffect(() => {
        const fetchMonthlyDetail = async () => {
            if(!selectedRowData) return;

            console.log(selectedRowData)
            setDetailLoading(true);
            setDetailError(null);
            try{
                const response = await fetchMonthlyDetailData(yearMonth, selectedRowData.serial_number);
                setDetailData(response);
            } catch (error) {
                setDetailError(error.message || "Failed to fetch detail data");
            } finally {
                setDetailLoading(false);
            }
        }

        fetchMonthlyDetail();
    }, [selectedRowData]);
    console.log('detail monthly data', detailData)

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                isExpanded &&
                !event.target.closest(".expanded-container") // ✅ 상세정보 영역 클릭 제외
            ) {
                setIsExpanded(false);
                setSelectedRowData(null);
            }
        };

        document.addEventListener("click", handleOutsideClick);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [isExpanded]);


    return (
        <div className={`grid gap-0 ${isExpanded ? "grid-cols-6" : "grid-cols-2"}`}>
            {/* Save */}
            <div className="col-span-6 flex flex-row justify-between border-b pb-3 mb-2 border-gray-400">
                <h1 className="text-2xl font-base">Monthly Data Save</h1>
                <SaveButton yearMonth={yearMonth} />
            </div>

            {/* Table */}
            <div className={`${isExpanded ? "col-span-2" : "col-span-6"}`}>
                <div className="flex flex-row items-center justify-between mb-3">
                    <h1 className="text-lg font-bold">
                        Selected Month:{" "}
                        {selectedDate.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                        })}
                    </h1>
                    <div className="flex flex-row z-10">
                        <MonthPicker value={selectedDate} onDateChange={handleDateChange} />
                    </div>
                </div>
                <ReusableTable
                    columns={MonthlyTableColumns}
                    data={data || []}
                    options={{
                        ...MonthlyTableOptions,
                        meta: {
                            onRowSelect: (selectedRow) => {
                                if (selectedRowData && selectedRowData.serial_number === selectedRow.serial_number) {
                                    // ✅ 이미 선택된 Row를 다시 클릭하면 닫기
                                    setIsExpanded(false);
                                    setSelectedRowData(null);
                                } else {
                                    // ✅ 새 Row를 선택하면 열기
                                    setSelectedRowData(selectedRow);
                                    setIsExpanded(true);
                                }
                            }
                        }
                    }}
                    isLoading={detailLoading}
                    error={detailError}
                />
            </div>

            {isExpanded && selectedRowData && (
                <div className="p-2 col-span-4 expanded-container">
                    <div className="flex flex-col">
                        <div className="flex flex-row justify-between mb-3">
                            <div className="flex flex-row items-center">
                                <span className="text-black font-semibold pr-3">Data Index:</span>
                                <h2 className="py-1 text-lg font-bold text-red-600">{selectedRowData.dataIndex}</h2>
                            </div>
                            <button
                                onClick={() => {
                                    setIsExpanded(false);
                                    setSelectedRowData(null);
                                }}
                                className="p-2 bg-red-500 text-white rounded-md"
                            >
                                닫기
                            </button>
                        </div>
                        <div className="p-4 bg-gray-100 rounded-lg">
                            <pre className="text-sm text-gray-700">{JSON.stringify(selectedRowData, null, 2)}</pre>
                            {detailLoading ? (
                                <LoadingSpinner/>
                            ) : detailError ? (
                                <p className="text-red-500">Error loading detail data: {detailError}</p>
                            ) : (
                                <MonthlyForm
                                    detailData={detailData}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MonthlyPage;
