import { useState, useEffect } from "react";
import { Tooltip } from '@mui/material'; // ✅ MUI Alert 추가
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
import MonthPickerArrow from '@/components/time/MonthPickerArrow.jsx';
import { IoMdClose } from "react-icons/io";
import DeviceMonthlyForm from '@/components/form/Monthly/DeviceMonthlyForm.jsx';


/**
 * @desc: 계산관리 페이지(monthly Page)
 * */
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

    // useEffect(() => {
    //     const handleOutsideClick = (event) => {
    //         if (
    //             isExpanded &&
    //             !event.target.closest(".expanded-container") // ✅ 상세정보 영역 클릭 제외
    //         ) {
    //             setIsExpanded(false);
    //             setSelectedRowData(null);
    //         }
    //     };
    //
    //     document.addEventListener("click", handleOutsideClick);
    //     return () => {
    //         document.removeEventListener("click", handleOutsideClick);
    //     };
    // }, [isExpanded]);
    console.log(selectedRowData)

    return (
        <div className={`grid gap-0 ${isExpanded ? "grid-cols-6" : "grid-cols-2"}`}>
            {/* Save */}
            <div className="col-span-6 flex flex-row justify-between border-b pb-3 mb-2 border-gray-400">
                <h1 className="text-xl font-base font-bold">단말기별 정산 내역 테이블</h1>
                <SaveButton yearMonth={yearMonth} />
            </div>

            {/* Table */}
            <div className={`p-2 ${isExpanded ? "col-span-2" : "col-span-6"}`}>
                <div className="flex flex-row items-center justify-between mb-3">
                    <h1 className="text-xl font-bold">
                        {' '}
                        {selectedDate.toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                        })}
                    </h1>
                    <div className="flex flex-row z-10">
                        <MonthPickerArrow value={selectedDate} onDateChange={handleDateChange} />
                    </div>
                </div>
                <ReusableTable
                    data={data || []}
                    columns={MonthlyTableColumns}
                    options={{
                        ...MonthlyTableOptions,
                        meta: {
                            onRowSelect: (selectedRow) => {
                                if (selectedRowData && selectedRowData.serial_number === selectedRow.serial_number) {
                                    // ✅ 이미 선택된 Row를 다시 클릭하면 닫기
                                    setSelectedRowData(null);
                                    setIsExpanded(false);
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
                <div className="p-2 col-span-4">
                    <div className="flex flex-col">
                        <div className="flex flex-row justify-between mb-4">
                            <div className="flex flex-row items-center">
                                <h1 className="py-1 text-xl font-bold">{selectedRowData.acct_num} _ {selectedRowData.serial_number}</h1>
                            </div>
                            <button
                                onClick={() => {
                                    setIsExpanded(false);
                                    setSelectedRowData(null);
                                }}
                                className="p-2 rounded-md text-black hover:text-gray-500"
                            >
                                <IoMdClose/>
                            </button>
                        </div>
                        <div className="bg-gray-100 rounded-lg">
                            {Array.isArray(detailData) && detailData.length > 0 ? (
                                <DeviceMonthlyForm detailData={detailData[0]} yearMonth={yearMonth}/>
                            ) : (
                                <p>No data available</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MonthlyPage;
