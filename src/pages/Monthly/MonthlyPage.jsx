import { useState, useEffect, useRef } from "react";
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
import DataActionDropdown from '@/components/common/DataActionDropdown.jsx';
import { exportToCSV } from '@/utils/csvExporter';
import { exportToExcel } from '@/utils/excelExporter';
import useMonthlyStore from '@/stores/monthlyStore.js';
/**
 * @desc: 계산관리 페이지(monthly Page)
 * */
const MonthlyPage = () => {
    const { selectedDate, handleDateChange, yearMonth } = useYearMonth();
    const {
        fetchMonthlyData,
        monthlyData,
        monthlyLoading,
        monthlyError,

        fetchDetailData,
        detailData,
        detailLoading,
        detailError,

        selectedRowData,
        isExpanded,
        selectedRow,
        resetSelection,
    } = useMonthlyStore();


    // 월별 데이터 fetch
    useEffect(() => {
        fetchMonthlyData(yearMonth);
    }, [yearMonth]);

    // 선택된 row가 있을 때 상세 데이터 fetch
    useEffect(() => {
        if (selectedRowData) {
            fetchDetailData(yearMonth, selectedRowData);
        }
    }, [selectedRowData]);


    console.log('monthlyData', monthlyData)
    console.log('detail monthly data', detailData)
    console.log(selectedRowData)

    const tableRef = useRef();
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
                    <div className="flex flex-row z-10 items-center space-x-4">
                        <MonthPickerArrow value={selectedDate} onDateChange={handleDateChange} />
                        <DataActionDropdown
                            onExportCSV={() => exportToCSV(monthlyData, 'Monthly.csv')}
                            onExportExcel={() => exportToExcel(monthlyData, 'Monthly.xlsx')}
                            onRefresh={fetchMonthlyData}
                        />
                    </div>
                </div>
                <ReusableTable
                    data={monthlyData || []}
                    columns={MonthlyTableColumns}
                    options={{
                        ...MonthlyTableOptions(selectedRowData),
                        meta: {
                            onRowSelect: (row) => selectedRow(row),
                        }
                    }}
                    // showExportButton={true}
                    isLoading={detailLoading}
                    error={detailError}
                />
            </div>

            {/* Detail Panel */}
            {isExpanded && selectedRowData && (
                <div className="p-2 col-span-4">
                    <div className="flex flex-col">
                        <div className="flex flex-row justify-between mb-4">
                            <div className="flex flex-row items-center">
                                <h1 className="py-1 text-xl font-bold">
                                    {selectedRowData.acct_num} _ {selectedRowData.serial_number}
                                </h1>
                            </div>
                            <button
                                onClick={resetSelection}
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
